const express = require("express")
const router = express.Router()
const db = require("../models/models")

const VerificarAuth = (req, res, next) => {
    if (!req.session.usuarioId) {
        return res.redirect('/Auth/Login');
    }
    next()
}
router.get("/", VerificarAuth, (req, res) => {
    const usuarioId = req.session.usuarioId;
    const nomeUsuario = req.session.usuarioNome;
    const tipoUsuario = req.session.usuarioTipo;

    if (tipoUsuario == "tecnico") {
        const query = `
            SELECT chamados.*, usuarios.nome AS nome_criador 
            FROM chamados 
            JOIN usuarios ON chamados.usuario_id = usuarios.id 
            ORDER BY chamados.criado_em DESC`;
        db.query(query, (err, resultados) => {
            if (err) {
                console.error("Erro ao buscar chamados: ", err)
                return res.status(500).send("Erro no servidor.");
            }
            
            res.render("./chamados", {
                nomeUsuario, chamados: resultados,
                fotoPerfil: req.session.fotoPerfil,
                tipoUsuario: tipoUsuario
            })
        })
    } else {
        const query = 'SELECT * FROM chamados WHERE usuario_id = ? ORDER BY criado_em DESC';
        db.query(query, [usuarioId], (err, resultados) => {
            if (err) {
                console.error("Erro ao buscar chamados: ", err);
                return res.status(500).send("Erro no servidor.");
            }
    
            res.render("./chamados", {
                nomeUsuario, chamados: resultados,
                fotoPerfil: req.session.fotoPerfil,
                tipoUsuario: tipoUsuario
            })
        })

    }

});

module.exports = router;