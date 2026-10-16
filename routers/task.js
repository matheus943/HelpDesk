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

router.post("/alteracao/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, prioridade } = req.body;
    const nomeUsuario = req.session.usuarioNome;
    const tipoUsuario = req.session.usuarioTipo;

    // Se o usuário for técnico, ele altera apenas a prioridade (via modal)
    if (tipoUsuario === "tecnico") {
        console.log("aq tb")
        const query = 'UPDATE chamados SET prioridade = ? WHERE id = ?';
        
        db.query(query, [prioridade || 'media', id], (err, resultado) => {
            if (err) {
                console.error("Erro ao alterar prioridade:", err);
                return res.status(500).send("Erro ao salvar a prioridade.");
            }
            return res.redirect('/home');
        });

    } else {
        // Se for cliente, consultamos o banco para verificar se ele é o criador do chamado
        const queryCheck = `
            SELECT chamados.*, usuarios.nome as nome_criador 
            FROM chamados 
            JOIN usuarios ON chamados.usuario_id = usuarios.id 
            WHERE chamados.id = ?
        `;
        
        db.query(queryCheck, [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).send("Chamado não encontrado.");
            }

            const chamado = results[0];

            // Valida se o cliente logado é quem criou o chamado
            if (chamado.nome_criador === nomeUsuario) {
                console.log("entrou")
                const queryUpdate = 'UPDATE chamados SET titulo = ?, descricao = ?, prioridade = ? WHERE id = ?';
                
                db.query(queryUpdate, [titulo, descricao, prioridade || 'media', id], (err, updateErr) => {
                    if (updateErr) {
                        console.error("Erro ao alterar chamado:", updateErr);
                        return res.status(500).send("Erro ao salvar o chamado.");
                    }
                    return res.redirect('/home');
                });
            } else {
                // Se tentar editar o chamado de outra pessoa
                return res.status(403).send("Acesso negado. Você não tem permissão para alterar este chamado.");
            }
        });
    }
});

module.exports = router;