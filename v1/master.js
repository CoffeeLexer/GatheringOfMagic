const express = require("express")

const router = express.Router()

router.use('/decks', require('./decks'))
router.use('/cards', require('./cards'))
router.use('/duels', require('./duels'))
router.use('/tournaments', require('./tournaments'))

module.exports = router