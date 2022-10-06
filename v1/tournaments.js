const express = require("express")
const db = require("../db")

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_tournament_full where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.json(result)
})
router.get(/\//, async (req, res) => {
    let result = await db.query(`select * from view_tournament_full`)
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
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