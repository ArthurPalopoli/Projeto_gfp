import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js'
import rotasCategorias from './routes/rotasCategorias.js'
import rotasSubCategorias from './routes/rotasSubCategorias.js'
import rotasContas from './routes/rotasContas.js'
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
app.get('/usuarios/filtrarNome', rotasUsuarios.filtrarNome)
app.get('/usuarios',  rotasUsuarios.listarTodos)
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)
app.get('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.consultaPorId)
app.put('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizarTodos) 
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar)

//Rotas Categorias ✅
app.post('/categorias', rotasCategorias.novaCategoria)
app.get('/categorias/filtrarCategoria', rotasCategorias.filtrarCategoria)
app.get('/categorias',  rotasCategorias.listarTodos)
app.delete('/categorias/:id_categoria', rotasCategorias.deletar)
app.get('/categorias/:id_categoria', rotasCategorias.consultaPorId)
app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodos)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)

//Rotas Sub-Categorias ✅
app.post('/subCategorias', autenticarToken, rotasSubCategorias.novaSubCategoria)
app.get('/subCategorias', autenticarToken,  rotasSubCategorias.listarTodos)
app.delete('/subCategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.deletar)
app.get('/subCategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.consultaPorId)
app.put('/subCategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.atualizarTodos)
app.patch('/subCategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.atualizar)

//Rotas Contas ✅
app.post('/contas', autenticarToken, rotasContas.novaConta)
app.get('/contas/filtrarNome', rotasContas.filtrarNome)
app.get('/contas', rotasContas.listarTodos)
app.delete('/contas/:id_conta',  rotasContas.deletar)
app.get('/contas/:id_conta', autenticarToken, rotasContas.consultaPorId)
app.put('/contas/:id_conta', autenticarToken, rotasContas.atualizarTodos)
app.patch('/contas/:id_conta', rotasContas.atualizar)


//Rotas Transação ✅
app.post('/transacoes',  rotasTransacoes.novaTransacao)
app.get('/transacoes/somarTransacoes', rotasTransacoes.somarTransacoes)
app.get('/transacoes/filtrarData', rotasTransacoes.filtrarPorData)
app.get('/transacoes/transacoesVencidas/:id_usuario', rotasTransacoes.transacoesVencidas)
app.get('/transacoes',   rotasTransacoes.listarTodos)
app.delete('/transacoes/:id_transacao',  rotasTransacoes.deletar)
app.get('/transacoes/:id_transacao',  rotasTransacoes.consultaPorId)
app.put('/transacoes/:id_transacao',  rotasTransacoes.atualizarTodos) 
app.patch('/transacoes/:id_transacao',  rotasTransacoes.atualizar)
