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
Clone o repositório</br>
git clone https://github.com/cmlacrd/hotel-api.git</br>

## Instale as dependências
npm install

## Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:</br>
DB_USER=admin</br>
DB_PASSWORD=m9rrQzBFULMUzvFT</br>

## Inicie o servidor
npm start

## Endpoints

### Usuários
#### POST /user
Cria um novo usuário na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
| Nome  | Tipo  | Requerido  |  Descrição |
|---|---|---|---|
| name | string | Sim | Nome do usuário |
| surname | string | Sim | Sobrenome do usuário|
| wallet | number | Não | Saldo do usuário |


Exemplo</br>
{</br>
"name": "Fulano",</br>
"surname": "de Tal",</br>
"wallet": 1500</br>
}</br>

#### GET /user
Busca todos os usuários na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
Nenhum.</br>

#### GET /user/:id
Busca o usuário específico na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
Nenhum.</br>

#### DELETE /user/:id
Deleta o usuário específico na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
Nenhum.</br>

#### PACTH /user/:id/walltet
Adiciona saldo na carteira do usuário na base de dados.</br>

##### Headers </br>
Nenhum.</br>

##### Body
| Nome | Tipo | Requerido | Descrição |
|---|---|---|---|
| amount | number | Sim | Saldo a ser adicionado |

{</br>
"amount": 10000</br>
}</br>

### Quartos
#### POST /room
Cria um novo quarto na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
| Nome | Tipo | Requerido | Descrição |
|---|---|---|---|
| name | string | Sim | Nome do quarto |
| price | number | Sim | preço do quarto |

Exemplo </br>
{</br>
"name": "Quarto suíte presidencial",</br>
"price": 750</br>
}</br>

#### GET /room
Busca todos os quartos na base de dados.</br>

##### Headers </br>
Nenhum.</br>

##### Body </br>
Nenhum.</br>

#### GET /room/:id
Busca o quarto específico na base de dados.</br>

##### Headers </br>
Nenhum.</br>

##### Body </br>
Nenhum.

#### DELETE /room/:id
Deleta o quarto específico na base de dados.</br>

##### Headers </br>
Nenhum.</br>

##### Body 
Nenhum.</br>

#### PACTH /room/:id
Atualiza o quarto na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
| Nome | Tipo | Requerido | Descrição |
|---|---|---|---|
| name | string | Sim | Nome do quarto |
| price | number | Sim | preço do quarto |

{</br>
"name": "Quarto suíte presidencial",</br>
"price": 1000</br>
}</br>

### Reservas
#### POST /reservations
Cria uma nova reserva na base de dados.</br>

##### Headers
Nenhum.</br>

##### Body
| Nome | Tipo | Requerido | Descrição |
|---|---|---|---|
| roomId | Array | Sim | Id do Quarto |
| userId | string | Sim | Id do usuário que está fazendo a reserva |
| checkin | date | Sim | Data de Check-in |
| checkout | date | Sim | Data de Check-out |
| numberRooms | number | Sim | Número de quartos que estão sendo reservados |

Exemplo</br>
{</br>
    "roomId":["id1","id2"],</br>
    "userId":"idUser",</br>
    "checkin": "2023-08-14",</br>
    "checkout": "2023-08-15",</br>
    "numberRooms": 2</br>
}</br>

#### PACTH /reservations/:id/payment
Envia um comprovante de pagamento da reserva.</br>

##### Headers
Nenhum.</br>

##### Body
Nenhum.</br>

#### GET /reservations/:id/download-pdf
Gera um PDF com as informações da reserva.</br>

##### Headers
Nenhum.</br>

##### Body
Nenhum.</br>
