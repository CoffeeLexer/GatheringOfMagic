const express = require("express")

const router = express.Router()

router.use('/decks', require('./decks'))
router.use('/cards', require('./cards'))
router.use('/duels', require('./duels'))
router.use('/tournaments', require('./tournaments_duels_decks'))
router.use('/tournaments', require('./tournaments_duels'))
router.use('/tournaments', require('./tournaments'))

module.exports = router