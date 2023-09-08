const {infoBanco} = require('../data/bancodedados')
const senhaDobanco = infoBanco.banco.senha

const verificaSenha = (req, res, next) => {
    try {
        const { senha } = req.query

        if (!senha) {
            res.status(401).json("Insira uma senha na URL")
        }

        if (senha === senhaDobanco) {
            next()
        } else {
            res.status(401).json("Entrada Não autorizada senha ou usúario errados")
        }

    } catch (error) {
        console.error(`Erro na passagem do middleware. Erro: ${error}`)
    }

}

module.exports = verificaSenha