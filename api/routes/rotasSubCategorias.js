import { BD } from '../db.js';

class rotasSubCategorias{
    static async novaSubCategoria(req, res){
        const {nome, id_categoria, gasto_fixo, ativo } = req.body;

        try{
            const subcategoria = await BD.query(`
                INSERT INTO subcategorias(nome, id_categoria, gasto_fixo, ativo)
                VALUES($1, $2, $3, $4)
                `, [nome, id_categoria, gasto_fixo, ativo])

            res.status(201).json({message: 'Sub-Categoria Cadastrada'})
        }catch(error){
            console.error('Erro ao Criar' , error);
            res.status(500).json({message: 'Erro ao Criar Sub-Categoria', error: error.message})
        }

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async listarTodos(req, res){
        try{
            const subcategorias = await BD.query('SELECT * FROM subcategorias WHERE ativo = true');
            return res.status(200).json(subcategorias.rows); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message: 'Erro ao listar Sub-Categorias', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async deletar(req, res){
        const { id } = req.params;
        try{
            const subcategoria = await BD.query(
                'UPDATE subcategorias set ativo = false WHERE id_subcategoria = $1', [id]);
            return res.status(200).json({message: "Sub-Categoria desativada com sucesso"});
        } catch(error){
            res.status(500).json({message: 'Erro ao desativar Sub-Categoria', error: error});
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async consultaPorId(req, res){
        const { id } = req.params;
        try{
            const subcategoria = await BD.query('SELECT * FROM subcategorias WHERE id_subcategoria = $1 ', [id])
            res.status(200).json(subcategoria.rows[0]);
        }catch(error){
            res.status(500).json({message: 'Erro ao consultar a Sub-Categoria', error: error});
        }
        
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizarTodos(req, res){
        const { id } = req.params;
        const {nome, id_categoria, gasto_fixo, ativo, id_subcategoria} = req.body;

        try {
            const subcategoria = await BD.query(
                'UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3, ativo = $4 WHERE id_subcategoria = $5 RETURNING *',
                [nome, id_categoria, gasto_fixo, ativo, id_subcategoria]
            );

            return res.status(200).json({ message: "Sub-Categoria atualizada com sucesso", subcategoria: subcategoria.rows[0] });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar Sub-Categoria', error: error.message });
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async atualizar(req, res){
        const { id } = req.params;
        const { nome, id_categoria, gasto_fixo, ativo, id_subcategoria} = req.body;
        try{
            //Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(nome);
            }
            if(id_categoria !== undefined){
                campos.push(`id_categoria = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(id_categoria);
            }
            if(gasto_fixo !== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(gasto_fixo);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(ativo);
            }
            if(id_subcategoria !== undefined){
                campos.push(`id_subcategoria = $${valores.length + 1}`) //Usa o tamanho do array para determinar o campo
                valores.push(id_subcategoria);
            }
            if(campos.length === 0){
                return res.status(400).json({message:'Nenhum campo fornecido para atualização'})
            }

            //adicionar o id ao final de valores
            // valores.push(id);

            //montamos a query dinamicamente
            const query = `UPDATE subcategorias SET ${campos.join(', ')} WHERE id_subcategoria = ${id} RETURNING *`;
            //executar a query
            const subcategoria = await BD.query(query, valores);

            //Verifica se o usuário foi atualizado
            if(subcategoria.rows.length === 0){
                return res.status(404).json({message: 'Sub-Categoria não encontrada'});
            }
            return res.status(200).json(subcategoria.rows[0]); 
        }
        catch(error){
            console.log(error.message);            
            res.status(500).json({message: 'Erro ao atualizar Sub-Categoria', error: error}); 
        }
    }

}


export default rotasSubCategorias