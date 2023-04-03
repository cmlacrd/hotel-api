//export 
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
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes)

const roomRoutes = require('./routes/roomRoutes')
app.use('/room', roomRoutes)

app.get('/', (req,res) => {
    res.json({message: 'Oi, teste'})
})

//conexao com o banco
mongoose.connect('mongodb+srv://admin:admin@hotel.k8ycxbe.mongodb.net/bancoAPI?retryWrites=true&w=majority')
.then(() => {
    console.log('Conexão com o banco feita com sucesso')
    app.listen(3000)
})
.catch((err) => console.log(err))

