const express = require("express")

const router = express.Router()

router.use('/sessions', require('./sessions'))
router.use('/users', require('./users'))
router.use('/tournaments', require('./duels'))
router.use('/duels', require('./duels_patch'))
router.use('/decks', require('./decks'))
router.use('/cards', require('./cards'))
router.use('/tournaments', require('./tournaments'))
router.use('/', require('./root'))

module.exports = router