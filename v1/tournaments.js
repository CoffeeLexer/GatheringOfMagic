const express = require("express")
const db = require("../db")

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from tournament where id = '${id}'`)
    res.json(result)
})
router.get(/\//, async (req, res) => {
    let result = await db.query(`select * from tournament`)
    res.json(result)
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