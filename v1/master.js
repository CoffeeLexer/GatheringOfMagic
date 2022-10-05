const express = require("express")

const router = express.Router()

router.use('/decks', require('./decks'))
router.use('/tournaments', require('./tournaments'))

module.exports = router