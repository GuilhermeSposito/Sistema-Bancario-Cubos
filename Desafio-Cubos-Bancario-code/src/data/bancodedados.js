const infoBanco = {
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
        {
            "numero": "1",
            "saldo": 0,
            "usuario": {
                "nome": "Foo Bar",
                "cpf": "00011122233",
                "data_nascimento": "2021-03-15",
                "telefone": "71999998888",
                "email": "foo@bar.com",
                "senha": "1234"
            }
        },
        {
            "numero": "2",
            "saldo": 1000,
            "usuario": {
                "nome": "Foo Bar 2",
                "cpf": "00011122234",
                "data_nascimento": "2021-03-15",
                "telefone": "71999998888",
                "email": "foo@bar2.com",
                "senha": "12345"
            }
        },

    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],

}

let keyAutoIncrement
if (infoBanco.contas.length === 0) {
    keyAutoIncrement = 1
} else {
    keyAutoIncrement = (Number(infoBanco.contas[infoBanco.contas.length - 1].numero) + 1)
}

module.exports = {
    infoBanco,
    keyAutoIncrement
}