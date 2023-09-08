const { infoBanco } = require('../data/bancodedados')

const verificadorSeAContas = (contas) => {
    if (contas.length === 0) {
        return false
    } else {
        return true
    }
}

//verificador para ver se todos as propriedades obrigatórias foram passadas, caso tenham cido passadas, retornar um objeto com elas, caso não, retornar false 
const verificaPropriedades = (req) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (nome && cpf && data_nascimento && telefone && email && senha) {
        return {
            nome, cpf, data_nascimento, telefone, email, senha
        }
    } else {
        return false
    }

}

const tamanhoValidoCpf = (cpf) => {
    //transforma primeiro o cpf que chega em string, para caso o usuario mande em número ele consiga reconhecer
    const verifica = String(cpf).length == 11 ? true : false

    return verifica
}

//function para verificar o email e cpf, apenas basta passar o usuario inserido e fazer um find para verificar 
const verificaCpfOuEmailRepetidos = (usuarioInserido) => {
    //essa function vai receber o usuario inserido no body
    const { cpf, email } = usuarioInserido

    //conferir se tem esse cpf e email ou não 
    const confereCPF = infoBanco.contas.find(usuario => { return usuario.usuario.cpf == cpf })
    const confereEMAIL = infoBanco.contas.find(usuario => { return usuario.usuario.email == email })

    //caso não tenha cpf ou email repetidos, vamos retornar um false na function 
    if (!confereCPF && !confereEMAIL) {
        return false
    }

    //caso email e cpf não sejam false, é porque tem email e cpf repetidos, então vamos enviar a msg em string falando qual dos dois está repetido ou se está os dois 

    let mensagemDeRepetido = Array()
    //caso for feito mais requisição, ele vai ter mais itens no array, precisamos limpar antes 
    if (mensagemDeRepetido.length != 0) {
        if (mensagemDeRepetido.length === 1) {
            mensagemDeRepetido.shift()
        } else if (mensagemDeRepetido.length === 1) {
            mensagemDeRepetido.shift()
            mensagemDeRepetido.shift()
        }

    }

    if (confereCPF) {
        mensagemDeRepetido.push("cpf")
    }

    if (confereEMAIL) {
        mensagemDeRepetido.push("email")
    }

    if (mensagemDeRepetido.length == 1) {
        return mensagemDeRepetido = `${mensagemDeRepetido[0]} Já está sendo ultilizado.`
    }

    return mensagemDeRepetido = `${mensagemDeRepetido.join(' E ')} Já Estão sendo ultilizados, escolha outro.`



}


//verificar se a conta existe, se existir retornar true, se não false 
const contaExiste = (numeroConta) => {
    const contaExistente = infoBanco.contas.find(conta => { return conta.numero == numeroConta })

    if (!contaExistente) {
        return false
    }

    if (contaExistente) {
        return true
    }

}

const verificaSaldoVazio = (numeroConta) => {
    const contaEncontrada = infoBanco.contas.find(conta => { return conta.numero == numeroConta })

    const saldoVazio = contaEncontrada.saldo <= 0 ? true : false

    return saldoVazio
}


const verificacaoDeSaldoMenor = (numeroConta, valor) => {
    const contaEncontrada = infoBanco.contas.find(conta => { return conta.numero == numeroConta })

    const somaDeValor = contaEncontrada.saldo - valor

    return somaDeValor < 0 ? true : false
}


const verificaSenha = (numeroConta, senhaInserida) => {
    const usuarioEncontrado = infoBanco.contas.find(conta => { return numeroConta == conta.numero })

    const senhaEstaCorreta = usuarioEncontrado.usuario.senha == senhaInserida ? true : false

    return senhaEstaCorreta
}



module.exports = {
    verificadorSeAContas,
    verificaPropriedades,
    tamanhoValidoCpf,
    verificaCpfOuEmailRepetidos,
    contaExiste,
    verificaSaldoVazio,
    verificaSenha,
    verificacaoDeSaldoMenor
}