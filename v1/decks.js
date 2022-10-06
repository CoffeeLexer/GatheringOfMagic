const express = require("express")
const db = require("../db");
const utilities = require("../utilities");

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_deck where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(`[${e.cards}]`.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    if(result.length === 0) return res.status(404).send('')
    res.status(200).json(result[0])
})
router.get(/\//, async (req, res) => {
    let result = await db.query(`select * from view_deck limit 100`)
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(`[${e.cards}]`.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result)
})
router.post(/\//, async (req, res) => {
    let test = utilities.structure_test(req.body, ["name", "owner", "cards"])
    if(test) return res.status(400).send(`Missing fields: ${test}`)
})
router.put(/\//, async (req, res) => {
})
router.patch(/\//, async (req, res) => {
})
router.delete(/\//, async (req, res) => {
})

module.exports = router