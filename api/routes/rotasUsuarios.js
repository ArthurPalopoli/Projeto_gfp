import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'chave_bd_gfp'
class rotasUsuarios{
    static async novoUsuario(req, res){
        const {nome, email, senha, tipo_acesso, ativo} = req.body;

        const saltRounds = 10
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
        try{
            // const usuario = await BD.query(`
            //     INSERT INTO usuarios(nome, email, senha, tipo_acesso)
            //     VALUES($1, $2, $3, $4)
            //     `, [nome, email, senhaCriptografada, tipo_acesso])

            const query = `INSERT INTO usuarios(nome, email, senha, tipo_acesso) VALUES($1, $2, $3, $4)`
            const valores = [nome, email, senhaCriptografada, tipo_acesso]
            const resposta = await BD.query(query, valores)

            res.status(201).json({message: 'Usuário Cadastrado'})
        }catch(error){
            console.error('Erro ao Criar' , error);
            res.status(500).json({message: 'Erro ao Criar Usuário', error: error.message})
        }

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        try {
            // Busca o usuário pelo email (não compara a senha na consulta)
            const resultado = await BD.query(
                `SELECT id_usuario, nome, email, senha
                FROM usuarios
                WHERE email = $1`,
                [email]
            );

            if (resultado.rows.length === 0) {
                return res.status(401).json({ message: "Email ou senha inválidos." });
            }

            const usuario = resultado.rows[0];

            // Compara a senha fornecida com o hash armazenado
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json({ message: "Email ou senha inválidos." });
            }
            // Gerar um token para o usuário
            const token = jwt.sign(
                { id: usuario.id_usuario,
                    nome: usuario.nome, email: usuario.email },
                    SECRET_KEY,
                        {expiresIn: '1h'}
            )

            return res.status(200).json({ message: 'Login realizado com sucesso', token });
            // return res.status(200).json({ message: 'Login realizado com sucesso' });

        } catch (error) {
            console.error('Erro ao localizar login:', error);
            res.status(500).json({ message: 'Erro ao fazer login', error });
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const usuarios = await BD.query('SELECT * FROM usuarios WHERE ativo = true'); //Chamar o metodo listar na model usuario
            return res.status(200).json(usuarios.rows); //retorna a lista de usuarios
        }catch(error){
            res.status(500).json({message: 'Erro ao listar usuarios', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id } = req.params;
        try{
            const usuario = await BD.query(
                'UPDATE usuarios set ativo = false WHERE id_usuario = $1', [id]);
            return res.status(200).json({message: "Usuario deletado com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao deletar usuario', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id } = req.params;
        try{
            const usuario = await BD.query('SELECT * FROM usuarios WHERE id_usuario = $1 ', [id])
            res.status(200).json(usuario.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar o usuario', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id } = req.params;
        const {nome, email, senha, tipo_acesso, ativo, id_usuario } = req.body;
        try{
            const usuario = await BD.query(
                'UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4, ativo = $5 WHERE id_usuario = $6 RETURNING *',
                    [nome, email, senha, tipo_acesso, ativo, id_usuario]);// comando SQL para atualizar o usuario
            return res.status(200).json({message: "Usuario atualizado com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao atualizar Usuario', error: error});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id } = req.params;
        const { nome, email, senha, tipo_acesso, ativo, id_usuario } = req.body;
        try{
            //Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(nome);
            }
            if(email !== undefined){
                campos.push(`email = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(email);
            }
            if(senha !== undefined){
                campos.push(`senha = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(senha);
            }
            if(tipo_acesso !== undefined){
                campos.push(`tipo_acesso = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(tipo_acesso);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(ativo);
            }
            if(id_usuario !== undefined){
                campos.push(`id_usuario = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(id_usuario);
            }
            if(campos.length === 0){
                return res.status(400).json({message:'Nenhum campo fornecido para atualização'})
            }

            //adicionar o id ao final de valores
            // valores.push(id);

            //montamos a query dinamicamente
            const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ${id} RETURNING *`;
            //executar a query
            const usuario = await BD.query(query, valores);

            //Verifica se o usuário foi atualizado
            if(usuario.rows.length === 0){
                return res.status(404).json({message: 'Usuario não encontrado'});
            }
            return res.status(200).json(usuario.rows[0]); 
        }
        catch(error){
            console.log(error.message);            
            res.status(500).json({message: 'Erro ao atualizar usuario', error: error}); 
        }
    }
}

export function autenticarToken(req, res, nextb) {
    //Extrair do token o cabecalho da requisição
    const token = req.headers['authorization'];//Bearer<token>

    //Verificar se o token foi fornecido na requisição
    if(!token) return res.status(403).json({mensagem: 'Token não fornecido'})

    //Verificar a validade do Token
    //jwt.verify que valida se o token é legitimo
    jwt.verify(token.split('')[1], SECRET_KEY, (err, usuario) => {
        if(err) return res.status(403).json({mensagem: 'Token inválido'})

        //Se o token for válido, adiciona os dados do usuario(decodificados no token)
        //tornando essas informações disponíveis nas rotas que precisam da autenticação
        req.usuario = usuario;
        nextb();
    })
}


export default rotasUsuarios