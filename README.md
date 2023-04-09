# Hotel API
Uma API para gerenciamento de reservas de hotéis.

## Descrição
Este projeto consiste em uma API RESTful que possibilita a criação de reservas em hotel.

A API foi construída utilizando Node.js com o framework Express, e o banco de dados MongoDB foi utilizado para armazenar as informações das reservas e usuários.

## Funcionalidades
- Cadastro de usuários
- Consulta de usuários
- Exclusão de usuários
- Atualização de saldo de usuários

- Cadastro de quartos
- Exclusão de quartos
- Consulta de quartos
- Atualização de quartos

- Criação de reservas
- Upload de pagamento de reservas
- Download de confirmação de reservas

## Instalação
Clone o repositório
git clone https://github.com/cmlacrd/hotel-api.git

## Instale as dependências
npm install

## Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:
DB_USER=admin
DB_PASSWORD=m9rrQzBFULMUzvFT

## Inicie o servidor
npm start

## Endpoints

### Usuários
#### POST /user
Cria um novo usuário na base de dados.

Headers
Nenhum.

Body
| Nome  | Tipo  | Requerido  |  Descrição |
|---|---|---|---|
| name | string | Sim | Nome do usuário |
| surname | string | Sim | Sobrenome do usuário|
| wallet | number | Não | Saldo do usuário |


Exemplo
{
"name": "Fulano",
"surname": "de Tal",
"wallet": 1500
}

#### GET /user
Busca todos os usuários na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### GET /user/:id
Busca o usuário específico na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### DELETE /user/:id
Deleta o usuário específico na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### PACTH /user/:id/walltet
Adiciona saldo na carteira do usuário na base de dados.

Headers
Nenhum.

Body
Nome Tipo Requerido Descrição
amount number Sim Saldo a ser adicionado

{
"amount": 10000
}

### Quartos
#### POST /room
Cria um novo quarto na base de dados.

Headers
Nenhum.

Body
| Nome | Tipo | Requerido | Descrição |
|---|---|---|---|
| name | string | Sim | Nome do quarto |
| price | number | Sim | preço do quarto |

Exemplo
{
"name": "Quarto suíte presidencial",
"price": 750
}

#### GET /room
Busca todos os quartos na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### GET /room/:id
Busca o quarto específico na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### DELETE /room/:id
Deleta o quarto específico na base de dados.

Headers
Nenhum.

Body
Nenhum.

#### PACTH /room/:id
Atualiza o quarto na base de dados.

Headers
Nenhum.

Body
Nome Tipo Requerido Descrição
name string Sim Nome do quarto
price number Sim preço do quarto

{
"name": "Quarto suíte presidencial",
"price": 1000
}

### Reservas
#### POST /reservations
Cria uma nova reserva na base de dados.

Headers
Nenhum.

Body
| Nome | Tipo | Requerido |Descrição|
|---|---|---|---|---|
| roomId  | Array | Sim | Id do Quarto |
| userId  | string | Sim | Id do usuário que está fazendo a reserva |
| checkin | date | Sim | Data de Check-in |
| checkout | date | Sim | Data de Check-out |
| numberRooms | number | Sim | Número de quartos que estão sendo reservados |

Exemplo
{
    "roomId":["id1","id2"],
    "userId":"idUser",
    "checkin": "2023-08-14",
    "checkout": "2023-08-15",
    "numberRooms": 2
}

#### PACTH /reservations/:id/payment
Envia um comprovante de pagamento da reserva.

Headers
Nenhum.

Body
Nenhum.

#### GET /reservations/:id/download-pdf
Gera um PDF com as informações da reserva.

Headers
Nenhum.

Body
Nenhum.
