const express = require("express")
const db = require('./../db')
const url = require('url')

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from card where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({"error": "Not found"})
    result.forEach((e, i, arr) => {
        arr[i].card = e.content.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, '')
        arr[i].card = JSON.parse(arr[i].card)
        arr[i].content = undefined
    })
    res.status(200).json(result[0])
})
router.get(/\//, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let result = await db.query(`select * from card limit ${pageSize} offset ${(page - 1) * pageSize}`)
    result.forEach((e, i, arr) => {
        arr[i].card = e.content.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, '')
        arr[i].card = JSON.parse(arr[i].card)
        arr[i].content = undefined
    })
    res.status(200).json(result)
})

module.exports = router