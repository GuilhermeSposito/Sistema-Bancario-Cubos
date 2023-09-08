**Tecnologias usadas:**

![javaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![Guilherme's_Head](https://img.shields.io/badge/Guilherme's_Head-414141?style=for-the-badge&logo=google-play&logoColor=white)

#  API RESTful Sistema Bancario.



## Descrição da API.

API De Sistema bancario com Persistências dos dados.
> Futuramente será implementado banco de dados. 

RESTful API que permite:

-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

**Importante: Sempre que a validação de uma requisição falhar, Será gerado um código de erro e mensagem adequada à situação, ok?**

**Exemplo:**

```javascript
// Quando é informado um número de conta que não existe:
// HTTP Status 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

## Persistências dos dados

Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. **Todas as transações e contas bancárias Serão inseridas dentro deste objeto, seguindo a estrutura que já existe.**

> Obs: Apenas até implementação do banco de dados 






---
## EndPoints. 

1. Para listar todas as Contas. Usar o método GET. Passando a senha do Banco como query params na url.
```javascript
http://localhost:3000/contas?senha=
``` 
---
2. Para inserir uma conta, usar o método POST. Passar um objeto no Body da requisição.
```javascript
http://localhost:3000/contas
```
**Observações:**

-   É necessário se atentar ao objeto passado no body da requisição, Deve seguir o seguinte formato:
```javascript
{
   "nome": "Roberto Guidozi",
   "cpf": "45898777486",
   "data_nascimento": "2000-01-17",
   "telefone": "16992366175",
   "email": "Robertao.js@gmail.comm",
   "senha": "1789"
}
```
> Obs: O CPF deve obrigatóriamente ter 11 digitos e  deve ser passado em forma de STRING.

---
3. Para Atualizar os dados do usuário da conta bancária, Deve ser usado o método PUT. Passar o numero da conta na url, como parâmetro.
```javascript
http://localhost:3000/contas/:numeroConta/usuario
```
**Observações:**

-   É necessário se atentar ao objeto passado, Deve seguir o seguinte formato
```javascript
{ 
	
  "nome": "Guilherme Sposito",
  "cpf": "00000000232",
  "data_nascimento": "1899-01-17",
  "telefone": "1885528575",
  "email":  "Guziao@sClaaaqnsm.com",
  "senha": "1785"
}

```
> OBS: Não se deve passar um CPF Repetido, apenas se for o mesmo da conta a ser atualizada.


---
4. Para Deletar uma conta, usar o método DELETE. Passar o número da conta na url como parâmetro.
```javascript
http://localhost:3000/contas/:numeroDaConta
```
---
5. Para depositar em uma conta, usar o método POST. Deve se passar um objeto no corpo da requisição.
```javascript
http://localhost:3000/transacoes/depositar
```
**Observações:**

-   É necessário se atentar ao objeto passado, Deve seguir o seguinte formato
```javascript
{ 
	
	"numero_conta": "2",
	"valor": 300

}
```
> Neste caso, Deve se passar o numero_conta em String e o valor em Number.

---
6. Para sacar deve se usar o método POST. Deve se passar um objeto no corpo da requisição.
```javascript
http://localhost:3000/transacoes/sacar
```
**Observações:**

-   É necessário se atentar ao objeto passado, Deve seguir o seguinte formato
```javascript
{ 
	
	
	"numero_conta": "2",
	"valor": 100,
	"senha": "12345"


}
```

> Neste caso, Deve se passar o numero_conta em String o valor em Number e a senha em String também.

---

7. Para transferir deve ser usado o método POST.  Deve se passar um objeto no corpo da requisição.
```javascript
http://localhost:3000/transacoes/transferir
```
-   É necessário se atentar ao objeto passado, Deve seguir o seguinte formato
```javascript
{ 
	
        
    "numero_conta_origem": "3",
    "numero_conta_destino": "2",
    "valor": 100,
    "senha": "12345"


}
```
> Neste caso apenas o valor deve ser passado em Number.

---

8. Para mostrar o saldo deve ser usado o método GET. Deve ser passado um número da conta e a senha que deseja ver  no query params.
```javascript
http://localhost:3000/contas/saldo?numero_conta=2&senha=12345
```
> Apenas retornara um objeto com o saldo

---

9. Para mostra o saldo deve se usar o método GET. Deve ser passado um número da conta e a senha que deseja ver o extrato no query params.
```javascript
http://localhost:3000/contas/extrato?numero_conta=2&senha=12345
```
> OBS: Se o extrato for vazio vai ser retornado um status code 204, Sem resposta no body. Caso tenha informações, sera retornado o extrato com um status code 200.



###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`