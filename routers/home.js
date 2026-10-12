const express = require("express")
const app = express()
const router = express.Router()
const connection = require("../models/models")


router.get("", (req, res) => {
    // Se o usuário não estiver logado, manda ele pro login
    if (!req.session.usuarioId) {
        return res.redirect('/Auth/Login');
    }

    // Se estiver logado, renderiza o painel passando o nome dele
    res.render('chamados', { nomeUsuario: req.session.usuarioNome });
});

module.exports = router;