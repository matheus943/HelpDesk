const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../../models/models')

// Upload imagem
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB por imagem
    fileFilter: (req, file, cb) => {
        // Aceita apenas imagens
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas ficheiros de imagem são permitidos!'), false);
        }
    }
});

// Tela de Cadastro
router.get('/cadastro', (req, res) => {
    res.render('auth/Cadastro');
});

router.post('/cadastro', upload.single('foto'), async (req, res) => {
    const { nome, email, senha } = req.body;

    const fotoPerfil = req.file ? req.file.filename : null;

    try {

        // Gerar Hash
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Salvar no Banco
        const query = 'INSERT INTO usuarios (nome, email, senha, foto_perfil) VALUES (?, ?, ?, ?)';
        db.query(query, [nome, email, senhaHash, fotoPerfil], (err, result) => {
            if(err) {
                console.error('Erro ao cadastrar usuário', err);
                return res.status(500).send('Erro no servidor ao cadastrar.');
            } res.redirect('./login');
        });
    } catch (error) {
        console.error("Erro no hash da senha:", error);
        res.status(500).send("Erro interno");
    }
})

// --- TELA DE LOGIN (GET) ---
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// --- PROCESSAR LOGIN (POST) ---
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // 1. Busca o usuário pelo e-mail no MySQL
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erro no login:', err);
            return res.status(500).send('Erro no servidor.');
        }

        // Se não encontrar o usuário com esse e-mail
        if (results.length === 0) {
            return res.send('E-mail ou senha incorretos.');
        }

        const usuario = results[0];

        // 2. Compara a senha digitada com o hash salvo no banco
        const senhaMatch = await bcrypt.compare(senha, usuario.senha);

        if (!senhaMatch) {
            return res.send('E-mail ou senha incorretos.');
        }

        // 3. Salva os dados do usuário na sessão (Sessão Ativa!)
        req.session.usuarioId = usuario.id;
        req.session.usuarioNome = usuario.nome;
        req.session.usuarioTipo = usuario.tipo;

        // Redireciona para o painel principal
        res.redirect('/home');
    });
});

// --- ROTA DE LOGOUT ---

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("./login")
    })
})

module.exports = router