//export 
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app =  express()


//configuracao
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

// rotas da API
const reservationRoutes = require('./routes/reservationRoutes')
app.use('/reservations', reservationRoutes)

const roomRoutes = require('./routes/roomRoutes')
app.use('/room', roomRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/user', userRoutes)

app.get('/', (req,res) => {
    res.json({message: 'Oi, teste'})
})

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

//conexao com o banco
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@hotel.k8ycxbe.mongodb.net/bancoAPI?retryWrites=true&w=majority`)
.then(() => {
    console.log('Conexão com o banco feita com sucesso')
    app.listen(3000)
})
.catch((err) => console.log(err))