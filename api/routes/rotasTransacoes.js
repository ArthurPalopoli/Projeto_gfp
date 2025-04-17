import { BD } from '../db.js';

    class rotasTransacoes{
        static async novaTransacao(req, res){
            const {valor, descricao, data_transacao,  data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

            try{
                const local_transacao = await BD.query(`
                    INSERT INTO transacoes(valor, descricao, data_transacao,  data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    `, [valor, descricao, data_transacao,  data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])

                res.status(201).json({message: 'Transação Cadastrada'})
            }catch(error){
                console.error('Erro ao Criar' , error);
                res.status(500).json({message: 'Erro ao Criar Transação', error: error.message})
            }

        }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const transacoes = await BD.query('SELECT * FROM transacoes');
            return res.status(200).json(transacoes.rows); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message: 'Erro ao listar Transação', error: error});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id } = req.params;
        try{
            const transacoes = await BD.query(
                'DELETE from transacoes WHERE id_transacao = $1', [id]);
            return res.status(200).json({message: " Transação desativada com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao desativar Transação', error: error});
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id } = req.params;
        try{
            const transacoes = await BD.query('SELECT * FROM transacoes WHERE id_transacao = $1 ', [id])
            res.status(200).json(transacoes.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar a Local Transação', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id_transacao } = req.params;
        const {valor, descricao, data_transacao,  data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body;
        
        try {
            const transacao = await BD.query(
                'UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3,  data_vencimento = $4, data_pagamento = $5, tipo_transacao = $6, id_local_transacao = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *',
                [valor, descricao, data_transacao,  data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual, id_transacao]
            );

            return res.status(200).json({ message: "Transação atualizada com sucesso", transacao: transacao.rows[0] });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar Transação', error: error.message });
        }
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id_transacao } = req.params;
        const {
            valor, descricao, data_transacao, data_vencimento, data_pagamento,
            tipo_transacao, id_local_transacao, id_categoria, id_subcategoria,
            id_usuario, num_parcelas, parcela_atual
        } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`);
                valores.push(valor);
            }
            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`);
                valores.push(descricao);
            }
            if (data_transacao !== undefined) {
                campos.push(`data_transacao = $${valores.length + 1}`);
                valores.push(data_transacao);
            }
            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`);
                valores.push(data_vencimento);
            }
            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`);
                valores.push(data_pagamento);
            }
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`);
                valores.push(tipo_transacao);
            }
            if (id_local_transacao !== undefined) {
                campos.push(`id_local_transacao = $${valores.length + 1}`);
                valores.push(id_local_transacao);
            }
            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`);
                valores.push(id_categoria);
            }
            if (id_subcategoria !== undefined) {
                campos.push(`id_subcategoria = $${valores.length + 1}`);
                valores.push(id_subcategoria);
            }
            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`);
                valores.push(id_usuario);
            }
            if (num_parcelas !== undefined) {
                campos.push(`num_parcelas = $${valores.length + 1}`);
                valores.push(num_parcelas);
            }
            if (parcela_atual !== undefined) {
                campos.push(`parcela_atual = $${valores.length + 1}`);
                valores.push(parcela_atual);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualização' });
            }

            // Adiciona o ID no final dos valores
            valores.push(id_transacao);

            // Monta a query dinamicamente
            const query = `UPDATE transacoes SET ${campos.join(', ')} WHERE id_transacao = $${valores.length} RETURNING *`;

            // Executa a query
            const transacao = await BD.query(query, valores);

            if (transacao.rows.length === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            return res.status(200).json({ message: 'Transação atualizada com sucesso', transacao: transacao.rows[0] });

        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: 'Erro ao atualizar Transação', error: error.message });
        }
    }
}
export default rotasTransacoes;
