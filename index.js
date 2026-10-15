require('dotenv').config();
const express = require("express")
const session = require('express-session')
const app = express()

app.use(session({
    secret: 'asdasdasdasdasdasdasdas',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}))

// Configuração para ler dados vindo de fomularios (req.body)
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

// Configuração do EJS e Arquivos Estáticos
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

const ChamadosRoutes = require("./routers/home")
const authRoutes = require('./routers/auth/AuthRoutes')
const ChamadosConfig = require("./routers/task")

// Configuração de Rotas
app.use("/home", ChamadosRoutes)
app.use("/auth", authRoutes);
app.use("/chamados", ChamadosConfig)



// Configuração da sessão

app.listen(8000, () => {
    console.log("Servidor rodando em http://localhost:8000")
});