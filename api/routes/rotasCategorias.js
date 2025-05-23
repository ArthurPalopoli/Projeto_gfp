import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

class rotasCategorias{
    static async novaCategoria(req, res){
        const {nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone } = req.body;

        try{
            const categoria = await BD.query(`
                INSERT INTO categorias(nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone)
                VALUES($1, $2, $3, $4, $5)
                `, [nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone])

            res.status(201).json({message: 'Categoria Cadastrada'})
        }catch(error){
            console.error('Erro ao Criar' , error);
            res.status(500).json({message: 'Erro ao Criar Categoria', error: error.message})
        }

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const categorias = await BD.query('SELECT * FROM categorias WHERE ativo = true');
            return res.status(200).json(categorias.rows); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message: 'Erro ao listar categorias', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id_categoria } = req.params;
        try{
            const categoria = await BD.query(
                'UPDATE categorias set ativo = false WHERE id_categoria = $1', [id_categoria]);
            return res.status(200).json({message: "Categoria desativada com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao desativar categoria', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id_categoria } = req.params;
        try{
            const categoria = await BD.query('SELECT * FROM categorias WHERE id_categoria = $1 ', [id_categoria])
            res.status(200).json(categoria.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar o usuario', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, ativo, id_usuario } = req.body;

        try {
            const categoria = await BD.query(
                'UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, ativo = $4, id_usuario = $5, cor = $6, icone = $7 WHERE id_categoria = $8 RETURNING *',
                [nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone, id_categoria]
            );

            return res.status(200).json({ message: "Categoria atualizada com sucesso", categoria: categoria.rows[0] });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar Categoria', error: error.message });
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone} = req.body;
        try{
            //Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(nome);
            }
            if(tipo_transacao !== undefined){
                campos.push(`tipo_transacao = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(tipo_transacao);
            }
            if(gasto_fixo !== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(gasto_fixo);
            }
            if(id_usuario !== undefined){
                campos.push(`id_usuario = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(id_usuario);
            }
            if(cor !== undefined){
                campos.push(`cor = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(cor);
            }
            if(icone !== undefined){
                campos.push(`icone = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(icone);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(ativo);
            }
            if(campos.length === 0){
                return res.status(400).json({message:'Nenhum campo fornecido para atualização'})
            }

            //adicionar o id ao final de valores
            // valores.push(id);

            //montamos a query dinamicamente
            const query = `UPDATE categorias SET ${campos.join(', ')} WHERE id_categoria = ${id_categoria} RETURNING *`;
            //executar a query
            const categoria = await BD.query(query, valores);

            //Verifica se o usuário foi atualizado
            if(categoria.rows.length === 0){
                return res.status(404).json({message: 'Categoria não encontrado'});
            }
            return res.status(200).json(categoria.rows[0]); 
        }
        catch(error){
            console.log(error.message);            
            res.status(500).json({message: 'Erro ao atualizar Categoria', error: error}); 
        }
    }

    // filtrar por tipo de categoria
    static async filtrarCategoria(req, res){
       const { tipo_transacao } = req.query

       try{
            const query = `
                SELECT * FROM categorias
                WHERE tipo_transacao = $1 AND ativo = true
                ORDER BY nome DESC
            `
            const valores = [tipo_transacao]

            const resposta = await BD.query(query, valores) 

            return res.status(200).json(resposta.rows)

       }catch(error){
            console.error('Erro ao filtar categoria', error)
            return res.status(500).json({message: "Erro ao filtar categoria", error: error.message})

       }
    }

    
}



export default rotasCategorias