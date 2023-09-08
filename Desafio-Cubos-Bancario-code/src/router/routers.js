const express = require("express")
const rotas = express()
const controllers = require('../controllers/controllers')
const middleware = require('../middleware/middleware')

rotas.get('/contas', middleware, controllers.mostraContas)
rotas.post('/contas', controllers.insereConta)
rotas.put('/contas/:numeroConta/usuario', controllers.atualizarConta)
rotas.delete('/contas/:numeroConta', controllers.excluirConta)
rotas.post('/transacoes/depositar', controllers.depositar)
rotas.post('/transacoes/sacar', controllers.sacar)
rotas.post('/transacoes/transferir', controllers.transferir)
rotas.get('/contas/saldo', controllers.mostraSaldo)
rotas.get('/contas/extrato', controllers.mostrarExtrato)


module.exports = rotas