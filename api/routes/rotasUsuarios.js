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
        const { id_usuario } = req.params;
        try{
            const usuario = await BD.query(
                'UPDATE usuarios set ativo = false WHERE id_usuario = $1', [id_usuario]);
            return res.status(200).json({message: "Usuario deletado com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao deletar usuario', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id_usuario } = req.params;
        try{
            const usuario = await BD.query('SELECT * FROM usuarios WHERE id_usuario = $1 ', [id_usuario])
            res.status(200).json(usuario.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar o usuario', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id_usuario } = req.params;
        const {nome, email, senha, tipo_acesso, ativo } = req.body;
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
        const { id_usuario } = req.params;
        const { nome, email, senha, tipo_acesso, ativo } = req.body;
        try{
            const campos = [];
            const valores = [];

            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) 
                valores.push(nome);
            }
            if(email !== undefined){
                campos.push(`email = $${valores.length + 1}`) 
                valores.push(email);
            }
            if(senha !== undefined){
                campos.push(`senha = $${valores.length + 1}`) 
                const saltRounds = 10
                const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
                valores.push(senhaCriptografada);
            }
            if(tipo_acesso !== undefined){
                campos.push(`tipo_acesso = $${valores.length + 1}`) 
                valores.push(tipo_acesso);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) 
                valores.push(ativo);
            }

            valores.push(id_usuario); // adiciona o id como último parâmetro da query

        const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = $${valores.length} RETURNING *`;
        const usuario = await BD.query(query, valores);

        if (usuario.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        return res.status(200).json(usuario.rows[0]);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o usuário', error: error.message });
    }
}
}

export function autenticarToken(req, res, next) {

    const token = req.headers['authorization'];

    if(!token) return res.status(403).json({mensagem: 'Token não fornecido'})

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, usuario) => {
        if(err) return res.status(403).json({mensagem: 'Token inválido'})

       
        req.usuario = usuario;
        next();
    })
}


export default rotasUsuarios