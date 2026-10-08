const express = require("express")
const app = express()
require('dotenv').config();
const ChamadosRoutes = require("./routers/home")

app.use(express.json())

app.use("/home", ChamadosRoutes)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.listen(8000, () => {
    console.log("Servidor rodando em http://localhost:8000")
});