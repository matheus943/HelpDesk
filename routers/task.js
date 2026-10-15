const express = require("express")
const app = express()
const router = express.Router()
const db = require("../models/models")

const VerificarAuth = (req, res, next) => {
    if (!req.session.usuarioId) {
        return res.redirect('/Auth/Login');
    }
    next();
}


router.post("/novo", VerificarAuth, (req, res) => {
    const { titulo, descricao, prioridade} = req.body;
    const usuarioId = req.session.usuarioId;

    

    const query = "INSERT INTO chamados (titulo, descricao, prioridade, usuario_id) VALUES (?, ?, ?, ?) ";
    db.query(query, [titulo, descricao, prioridade || 'media', usuarioId], (err, resultado) => {
        if (err) {
            console.error("Erro ao criar chamado:", err);
            return res.status(500).send("Erro ao salvar o chamado.");
        }

        res.redirect("/home")
    })

});

router.post("/alteracao", (req, res) => {


    const query = "UPDATE chamados SET status = ?";
})

module.exports = router;