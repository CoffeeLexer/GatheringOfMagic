const express = require("express")
const db = require('./../db')
const url = require('url')
const utilities = require('./../utilities')

const router = express.Router()

//  Public access
router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_card_final where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({"error": "Not found"})
    result.forEach((e, i, arr) => {
        arr[i].card = JSON.parse(Buffer.from(e.card.toString('binary'), 'base64'))
    })
    res.status(200).json(result[0])
})

// Public access
router.get(/\//, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let result = await db.query(`select * from new_view_card limit ${pageSize} offset ${(page - 1) * pageSize}`)
    result.forEach((e, i, arr) => {
        arr[i].card = JSON.parse(Buffer.from(e.card.toString('binary'), 'base64'))
    })
    res.status(200).json(result)
})

module.exports = router