const express = require("express")
const db = require("../db");

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_duel where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].tournament = JSON.parse(e.tournament)
        arr[i].decks = JSON.parse(e.decks.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result)
})
router.get(/\//, async (req, res) => {
    let result = await db.query(`select * from view_duel limit 100`)
    result.forEach((e, i, arr) => {
        arr[i].tournament = JSON.parse(e.tournament)
        arr[i].decks = JSON.parse(e.decks.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result)
})
router.post(/\//, async (req, res) => {
})
router.put(/\//, async (req, res) => {
})
router.patch(/\//, async (req, res) => {
})
router.delete(/\//, async (req, res) => {
})

module.exports = router