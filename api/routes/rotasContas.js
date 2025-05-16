import { BD } from '../db.js';

class rotasContas{
    static async novaConta(req, res){
        const {nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;

        try{
            const conta = await BD.query(`
                INSERT INTO contas(nome, tipo_conta, saldo, ativo, conta_padrao)
                VALUES($1, $2, $3, $4, $5)
                `, [nome, tipo_conta, saldo, ativo, conta_padrao])

            res.status(201).json({message: 'Conta Cadastrada'})
        }catch(error){
            console.error('Erro ao Criar' , error);
            res.status(500).json({message: 'Erro ao Criar Conta', error: error.message})
        }

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const conta = await BD.query('SELECT * FROM contas WHERE ativo = true');
            return res.status(200).json(conta.rows); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message: 'Erro ao listar Conta', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id_conta } = req.params;
        try{
            const conta = await BD.query(
                'UPDATE contas set ativo = false WHERE id_conta = $1', [id_conta]);
            return res.status(200).json({message: " Contas desativada com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao desativar Contas', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id_conta } = req.params;
        try{
            const conta = await BD.query('SELECT * FROM contas WHERE id_conta = $1 ', [id_conta])
            res.status(200).json(conta.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar a Contas', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id_conta } = req.params;
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;
        
        try {
            const contas = await BD.query(
                'UPDATE contas SET nome = $1, tipo_conta = $2, saldo = $3, ativo = $4, conta_padrao = $5 WHERE id_conta = $6 RETURNING *',
                [nome, tipo_conta, saldo, ativo, conta_padrao, id_conta]
            );

            return res.status(200).json({ message: "Contas atualizada com sucesso", contas: contas.rows[0] });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar Contas', error: error.message });
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id_conta } = req.params;
        const { nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;
        try{
            //Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(nome);
            }
            if(tipo_conta !== undefined){
                campos.push(`tipo_conta = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(tipo_conta);
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(saldo);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(ativo);
            }
            if(conta_padrao !== undefined){
                campos.push(`conta_padrao = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(conta_padrao);
            }
            if(campos.length === 0){
                return res.status(400).json({message:'Nenhum campo fornecido para atualização'})
            }

            //adicionar o id ao final de valores
            // valores.push(id_conta);

            //montamos a query dinamicamente
            const query = `UPDATE contas SET ${campos.join(', ')} WHERE id_conta = ${id_conta} RETURNING *`;
            //executar a query
            const conta = await BD.query(query, valores);

            //Verifica se o usuário foi atualizado
            if(conta.rows.length === 0){
                return res.status(404).json({message: 'Contas não encontrada'});
            }
            return res.status(200).json(conta.rows[0]); 
        }
        catch(error){
            console.log(error.message);            
            res.status(500).json({message: 'Erro ao atualizar Contas', error: error}); 
        }
    }

    static async filtrarNome(req, res){
       const { nome } = req.query

       try{
            const query = `
                SELECT * FROM contas
                WHERE nome LIKE $1 AND ativo = true
                ORDER BY nome DESC
            `
            const valor = [`%${nome}%`]
            const resposta = await BD.query(query, valor) 
            return res.status(200).json(resposta.rows)

       }catch(error){
            console.error('Erro ao filtar nome', error)
            return res.status(500).json({message: "Erro ao filtar nome", error: error.message})

       }
    }
}

export default rotasContas