const express = require("express")
const db = require('./../db')

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from card where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].card = e.content.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, '')
        arr[i].card = JSON.parse(arr[i].card)
        arr[i].content = undefined
    })
    res.status(200).json(result)
})
router.get(/\//, async (req, res) => {
    let result = await db.query(`select * from card limit 100`)
    result.forEach((e, i, arr) => {
        arr[i].card = e.content.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, '')
        arr[i].card = JSON.parse(arr[i].card)
        arr[i].content = undefined
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