import { BD } from '../db.js';

class rotasLocalTransacao{
    static async novaLocalTransacao(req, res){
        const {nome, tipo_local, saldo, ativo } = req.body;

        try{
            const local_transacao = await BD.query(`
                INSERT INTO local_transacao(nome, tipo_local, saldo, ativo)
                VALUES($1, $2, $3, $4)
                `, [nome, tipo_local, saldo, ativo])

            res.status(201).json({message: 'Local Transação Cadastrada'})
        }catch(error){
            console.error('Erro ao Criar' , error);
            res.status(500).json({message: 'Erro ao Criar Local Transação', error: error.message})
        }

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const local_transacao = await BD.query('SELECT * FROM local_transacao WHERE ativo = true');
            return res.status(200).json(local_transacao.rows); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message: 'Erro ao listar Local Transação', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id_local_transacao } = req.params;
        try{
            const local_transacao = await BD.query(
                'UPDATE local_transacao set ativo = false WHERE id_local_transacao = $1', [id_local_transacao]);
            return res.status(200).json({message: " Local Transação desativada com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao desativar Local Transação', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id_local_transacao } = req.params;
        try{
            const local_transacao = await BD.query('SELECT * FROM local_transacao WHERE id_local_transacao = $1 ', [id_local_transacao])
            res.status(200).json(local_transacao.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar a Local Transação', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id_local_transacao } = req.params;
        const {nome, tipo_local, saldo, ativo} = req.body;
        
        try {
            const local_transacao = await BD.query(
                'UPDATE local_transacao SET nome = $1, tipo_local = $2, saldo = $3, ativo = $4 WHERE id_local_transacao = $5 RETURNING *',
                [nome, tipo_local, saldo, ativo, id_local_transacao]
            );

            return res.status(200).json({ message: "Local Transação atualizada com sucesso", local_transacao: local_transacao.rows[0] });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar Local Transação', error: error.message });
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id_local_transacao } = req.params;
        const { nome, tipo_local, saldo, ativo} = req.body;
        try{
            //Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(nome);
            }
            if(tipo_local !== undefined){
                campos.push(`tipo_local = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(tipo_local);
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(saldo);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(ativo);
            }
            if(campos.length === 0){
                return res.status(400).json({message:'Nenhum campo fornecido para atualização'})
            }

            //adicionar o id ao final de valores
            // valores.push(id_local_transacao);

            //montamos a query dinamicamente
            const query = `UPDATE local_transacao SET ${campos.join(', ')} WHERE id_local_transacao = ${id_local_transacao} RETURNING *`;
            //executar a query
            const local_transacao = await BD.query(query, valores);

            //Verifica se o usuário foi atualizado
            if(local_transacao.rows.length === 0){
                return res.status(404).json({message: 'Local Transação não encontrada'});
            }
            return res.status(200).json(local_transacao.rows[0]); 
        }
        catch(error){
            console.log(error.message);            
            res.status(500).json({message: 'Erro ao atualizar Local Transação', error: error}); 
        }
    }
}

export default rotasLocalTransacao