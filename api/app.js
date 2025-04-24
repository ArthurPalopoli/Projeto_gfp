import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js'
import rotasCategorias from './routes/rotasCategorias.js'
import rotasSubCategorias from './routes/rotasSubCategorias.js'
import rotasLocalTransacao from './routes/rotasLocalTransacao.js'
import rotasTransacoes from './routes/rotasTransacoes.js'


const app = express()
testarConexao()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Funcionando')
})
const porta = 3000
app.listen(porta, () =>{
    console.log(`Api http://localhost:${porta}`)
})


//Rotas Usuarios ✅
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.post('/usuarios/login', rotasUsuarios.login)
app.get('/usuarios', autenticarToken, rotasUsuarios.listarTodos)
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)
app.get('/usuarios/:id_usuario', rotasUsuarios.consultaPorId)
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos) 
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)

//Rotas Categorias ✅
app.post('/categorias', rotasCategorias.novaCategoria)
app.get('/categorias',  rotasCategorias.listarTodos)
app.delete('/categorias/:id_categoria', rotasCategorias.deletar)
app.get('/categorias/:id_categoria', rotasCategorias.consultaPorId)
app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodos)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)

//Rotas Sub-Categorias ✅
app.post('/subCategorias', rotasSubCategorias.novaSubCategoria)
app.get('/subCategorias',  rotasSubCategorias.listarTodos)
app.delete('/subCategorias/:id_subcategoria', rotasSubCategorias.deletar)
app.get('/subCategorias/:id_subcategoria', rotasSubCategorias.consultaPorId)
app.put('/subCategorias/:id_subcategoria', rotasSubCategorias.atualizarTodos)
app.patch('/subCategorias/:id_subcategoria', rotasSubCategorias.atualizar)

//Rotas Local Transação ✅
app.post('/localTransacao', rotasLocalTransacao.novaLocalTransacao)
app.get('/localTransacao',  rotasLocalTransacao.listarTodos)
app.delete('/localTransacao/:id_local_transacao', rotasLocalTransacao.deletar)
app.get('/localTransacao/:id_local_transacao', rotasLocalTransacao.consultaPorId)
app.put('/localTransacao/:id_local_transacao', rotasLocalTransacao.atualizarTodos)
app.patch('/localTransacao/:id_local_transacao', rotasLocalTransacao.atualizar)


//Rotas Transação ✅
app.post('/transacoes', rotasTransacoes.novaTransacao)
app.get('/transacoes',  rotasTransacoes.listarTodos)
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletar)
app.get('/transacoes/:id_transacao', rotasTransacoes.consultaPorId)
app.put('/transacoes/:id_transacao', rotasTransacoes.atualizarTodos) 
app.patch('/transacoes/:id_transacao', rotasTransacoes.atualizar)
