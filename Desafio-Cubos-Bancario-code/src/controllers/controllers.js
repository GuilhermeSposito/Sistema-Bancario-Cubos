const { infoBanco } = require('../data/bancodedados')
let { keyAutoIncrement } = require('../data/bancodedados')
const { verificadorSeAContas, verificaPropriedades, tamanhoValidoCpf, verificaCpfOuEmailRepetidos, verificaSaldoVazio, contaExiste, verificaSenha, verificacaoDeSaldoMenor } = require('../verificadores/verificafunctions')
const contas = infoBanco.contas

const mostraContas = async (req, res) => {
    try {
        if (verificadorSeAContas(contas)) {
            return res.status(200).json(contas)
        }

        return res.status(404).json("Nenhuma conta encontrada")
    } catch (error) {

        console.log(`Erro ao mostrar contas erro: ${error}`)

    }
}

const insereConta = async (req, res) => {
    try {
        const usuarioInserido = verificaPropriedades(req)

        if (usuarioInserido) {
            if (!tamanhoValidoCpf(usuarioInserido.cpf)) {
                //se o tamanho do cpf for maior que 11 ou menor, ele vai falar que o numero passado é invalido
                return res.status(400).json({ Mensagem: "Tamanho do cpf invalido" })
            }
            //se entrar aqui o usuario foi passado completo no body
            //ao entrar aqui vamos verificar se já existe o cpf ou o email no banco de dados
            if (verificaCpfOuEmailRepetidos(usuarioInserido)) {
                //se entrar nesse if é porque o cpf ou email estão sendo usados já
                const mensagemDeRepetido = verificaCpfOuEmailRepetidos(usuarioInserido)
                return res.status(400).json(mensagemDeRepetido)
            }
            //se passar do if está tudo certo, só inserir

            const usuarioNovo = {
                numero: String(keyAutoIncrement++),
                saldo: 0,
                usuario: usuarioInserido
            }

            contas.push(usuarioNovo)

            return res.status(201).json()
        }

        if (!usuarioInserido) {
            //se entrar aqui o usuario NÃO foi passado completo no body
            return res.status(400).json({ mensagem: "Insira Todas as propriedades obrigatórias!" })
        }


    } catch (error) {
        console.log(`Erro ao inserir conta. Erro: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }



}

const atualizarConta = async (req, res) => {
    try {
        const usuarioInserido = verificaPropriedades(req)
        const { numeroConta } = req.params


        //verificar se a conta existe 
        if (!contaExiste(numeroConta)) {
            //se entrar aqui é porque a conta não existe 
            return res.status(400).json({ mensagem: "Conta não Encontrada" })
        }

        const contaAModificar = contas.find(conta => { return conta.numero === numeroConta })



        if (usuarioInserido) {
            //se entrar aqui é porque todas as informações obrigatórias foram inseridas no body
            //conferir se email ou cpf estão repitidos, porque se for apenas modificar apenas propriedades selecionadas, usar o patch, no caso do put devemos OBRIGATÓRIAMENTE mudar todos
            if (!tamanhoValidoCpf(usuarioInserido.cpf)) {
                //se o tamanho do cpf for maior que 11 ou menor, ele vai falar que o numero passado é invalido
                return res.status(400).json({ Mensagem: "Tamanho do cpf invalido" })
            }


            const verificaRepetidos = verificaCpfOuEmailRepetidos(usuarioInserido)
            if (verificaRepetidos) {
                let cpfRepetido = contas.find(conta => { return conta.usuario.cpf === usuarioInserido.cpf })
                let emailRepetido = contas.find(conta => { return conta.usuario.email === usuarioInserido.email })

                if (cpfRepetido) {
                    cpfRepetido = cpfRepetido.numero === numeroConta ? false : true
                }

                if (emailRepetido) {
                    emailRepetido = emailRepetido.numero === numeroConta ? false : true
                }


                if (!cpfRepetido && !emailRepetido) {
                    //só modifica se os dois forem igual a false, porque nenhum dos dois se repetem, e se repetirem, são da mesma conta que está sendo modificada
                    contaAModificar.usuario = usuarioInserido
                    return res.status(204).json()
                }


                //se entrar nesse if é porque o cpf ou email estão sendo usados já
                return res.status(400).json(verificaRepetidos)
            }


            contaAModificar.usuario = usuarioInserido


            return res.status(204).json()

        }


        if (!usuarioInserido) {
            //se entrar aqui o usuario NÃO foi passado completo no body
            res.status(400).json({ mensagem: "Insira Todas as propriedades obrigatórias!" })
        }

    } catch (error) {
        return res.status(500).json({ mensagem: "Internal error" })
        console.log(`Erro ao atualizar usúario. Erro: ${error}`)
    }
}

const excluirConta = async (req, res) => {
    try {
        const { numeroConta } = req.params
        const existeConta = contaExiste(numeroConta)

        if (existeConta) {
            //se entra aqui é porque a conta existe 
            //verificar se existe saldo, se existir não podemos excluir a conta

            if (verificaSaldoVazio(numeroConta)) {
                //se entra aqui é porque essa conta não tem saldo 
                const indiceConta = contas.findIndex(item => { return item.numero === numeroConta })
                contas.splice(indiceConta, 1)
                return res.status(204).json({ mensagem: "Conta Removida" })//mensagem não é mostrada com status 204. Só para ter base do que aconteceu.
            }

            if (!verificaSaldoVazio(numeroConta)) {
                //se entra aqui é porque tem saldo e não podemos excluir
                return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
            }

        }

        if (!existeConta) {
            //se entra aqui é porque a conta não existe 
            return res.status(400).json({ Mensagem: "Informe um número de conta valido" })
        }


    } catch (error) {
        console.error(`Erro ao excluir conta: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }
}


const depositar = async (req, res) => {
    try {
        const { numero_conta, valor } = req.body
        const existeConta = contaExiste(numero_conta)
        const { depositos } = infoBanco


        if (numero_conta && valor) {
            //se entra aqui é porque as porpriedades foram passadas
            if (existeConta) {
                //se entra aqui é porque a conta existe e vai ser inserido o valor 
                const data = Date()
                const contaASerDepositado = contas.find(conta => { return conta.numero == numero_conta })
                contaASerDepositado.saldo += valor

                depositos.push({ data, numero_conta, valor })

                return res.status(204).json()
            }

            return res.status(404).json({ Mensagem: "Conta Não encontrada" })
        }

        return res.status(400).json({ Mensagem: "Insira as propriedades obrigatórias" })


    } catch (error) {
        console.log(`Erro ao depositar em conta: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }
}


const sacar = async (req, res) => {
    try {//usuario
        const { numero_conta, valor, senha } = req.body
        const existeConta = contaExiste(numero_conta)
        const { saques } = infoBanco


        //primeiro a se verificar é se as propriedades foram inseridas 
        if (!numero_conta || !valor) {
            return res.status(400).json("Informações obrigatórias não foram inseridas")
        }


        //segundo a se verificar é se o usúario existe 
        if (existeConta) {
            //se entra aqui é porque existe, e vamos verificar a senha 
            const vericarSenha = verificaSenha(numero_conta, senha) //retorna true se a senha passada for certa, retorna false se não 

            if (vericarSenha) {
                //se entra aqui vamos ver se há saldo e sacar 
                const verificaSaldo = verificaSaldoVazio(numero_conta) // se retornar false é porque tem saldo, se não é porque esta vazio 

                if (!verificaSaldo && !verificacaoDeSaldoMenor(numero_conta, valor)) {
                    //se entra aqui é porque tem saldo e vai ser sacado 
                    if (valor < 0) {
                        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
                    }

                    const data = Date()
                    const contaASerSacada = contas.find(conta => { return conta.numero == numero_conta })
                    contaASerSacada.saldo -= valor

                    saques.push({ data, numero_conta, valor })

                    return res.status(204).json()

                }

                return res.status(403).json({ Mensagem: "Saldo insuficiente para saque" })

            }

            return res.status(401).json({ Mensagem: "Senha Incorreta" })
        }

        if (!existeConta) {
            //se entra aqui é porque não existe a conta 
            return res.status(404).json({ Mensagem: "Conta Não Encontrada" })
        }


    } catch (error) {
        console.log(`Erro ao sacar em conta: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }

}

const transferir = async (req, res) => {
    try {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
        const existeContaOrigem = contaExiste(numero_conta_origem)
        const existeContaDestino = contaExiste(numero_conta_destino)
        const { transferencias } = infoBanco


        //primeiro verificar se infomaçoes obrigatórias foram passadas
        if (!numero_conta_origem || !numero_conta_destino || !valor) {
            return res.status(400).json({ mensagem: "Informações obrigatórias não inseridas" })
        }

        if (existeContaOrigem && existeContaDestino) {
            //se entra nesse if é porque as duas contas existem
            const contaDeOrigem = contas.find(conta => { return conta.numero === numero_conta_origem })
            const contaDeDestino = contas.find(conta => { return conta.numero === numero_conta_destino })


            const vericarSenha = verificaSenha(numero_conta_origem, senha) //retorna true se a senha passada for certa, retorna false se não 
            if (vericarSenha) {
                //se entra aqui é porque a senha esta correta
                const verificaSaldo = verificaSaldoVazio(numero_conta_origem) // se retornar false é porque tem saldo, se não é porque esta vazio 

                if (!verificaSaldo && !verificacaoDeSaldoMenor(numero_conta_origem, valor)) {
                    //se entrar nesse if é porque tem saldo e vai ser depositado
                    if (valor < 0) {
                        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
                    }


                    const dataAtual = Date()
                    contaDeOrigem.saldo -= valor
                    contaDeDestino.saldo += valor


                    transferencias.push({ data: dataAtual, numero_conta_destino, numero_conta_origem, valor })

                    return res.status(204).json()

                }

                return res.status(403).json({ mensagem: "Saldo Insuficiente!" })

            }

            return res.status(401).json({ mensagem: "Senha Incorreta" })


        }


        if (!existeContaOrigem || !existeContaDestino) {
            //se entrar nesse if, é porque alguma das contas passadas não existem 
            if (!existeContaOrigem && existeContaDestino) {
                return res.status(404).json("Conta de Origem Inexistente")
            }

            if (existeContaOrigem && !existeContaDestino) {
                return res.status(404).json("Conta de Destino Inexistente")
            }

            return res.status(404).json("Contas Informadas Não Existem")
        }


    } catch (error) {
        console.log(`Erro ao transferir entre contas: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }


}

const mostraSaldo = async (req, res) => {
    try {
        const { numero_conta, senha } = req.query
        const existeConta = contaExiste(numero_conta)

        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Informações obrigatórias não inseridas" })
        }

        if (existeConta) {
            //se entra é porque conta existe 
            const vericarSenha = verificaSenha(numero_conta, senha) //retorna true se a senha passada for certa, retorna false se não 
            if (vericarSenha) {
                //se entra senha informada esta correta
                const contaEncontrada = contas.find(item => { return item.numero === numero_conta }).saldo

                return res.status(200).json({ saldo: contaEncontrada })

            }

            return res.status(401).json({ Mensagem: "Senha incorreta!" })

        }


        if (!existeConta) {
            return res.status(404).json({ mensagem: "Conta Informada Não Existe" })
        }


    } catch (error) {
        console.log(`Erro ao mostrar Saldo: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }
}



const mostrarExtrato = async (req, res) => {
    try {
        const { numero_conta, senha } = req.query
        const existeConta = contaExiste(numero_conta)
        const transferencias = infoBanco.transferencias
        const depositos = infoBanco.depositos
        const saques = infoBanco.saques


        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Informações obrigatórias não inseridas" })
        }

        if (existeConta) {
            //se entra é porque conta existe 
            const vericarSenha = verificaSenha(numero_conta, senha) //retorna true se a senha passada for certa, retorna false se não 
            if (vericarSenha) {
                //se entra senha informada esta correta
                //separar as tranferencias enviadas e recebidas da conta dentro do array de transferencia deposito e saques
                const transferenciasEnviadas = transferencias.filter(item => { return item.numero_conta_origem === numero_conta })
                const transferenciasRecebidas = transferencias.filter(item => { return item.numero_conta_destino === numero_conta })
                const depositosFeitos = depositos.filter(item => { return item.numero_conta === numero_conta })
                const saquesFeitos = saques.filter(item => { return item.numero_conta === numero_conta })

                if (transferenciasEnviadas.length == 0 && transferenciasRecebidas.length == 0 && depositosFeitos.length == 0 && saquesFeitos.length == 0) {
                    return res.status(204).json({ Mensagem: `Extrato Vazio` })// mensagem não é mostrada com o status code 204, só pra ter uma base.
                }


                const extrato = {
                    depositos: depositosFeitos,
                    saques: saquesFeitos,
                    transferenciasEnviadas,
                    transferenciasRecebidas,
                }


                return res.status(200).json(extrato)

            }

            return res.status(401).json({ Mensagem: "Senha incorreta!" })

        }


        if (!existeConta) {
            return res.status(404).json({ mensagem: "Conta Informada Não Existe" })
        }


    } catch (error) {
        console.log(`Erro ao mostrar Extrato: ${error}`)
        return res.status(500).json({ mensagem: "Internal Server error" })
    }
}


module.exports = {
    mostraContas,
    insereConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    mostraSaldo,
    mostrarExtrato
}