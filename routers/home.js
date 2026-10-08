const express = require("express")
const app = express()
const router = express.Router()
const connection = require("../models/models")


router.get("", (req, res) => {
    res.render('chamados');
})

module.exports = router;