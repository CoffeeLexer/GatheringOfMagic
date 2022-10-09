const express = require("express")
const db = require("../db");
const utilities = require("../utilities");
const url = require('url')

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_deck where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Not found`})
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(`[${e.cards}]`.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result[0])
})
router.get(/\//, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let result = await db.query(`select * from view_deck limit ${pageSize} offset ${(page - 1) * pageSize}`)
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(`[${e.cards}]`.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result)
})
router.post(/\//, async (req, res) => {
    let test = utilities.structure_test(req.body, ["name", "owner", "cards"])
    if(test) return res.status(400).json({error: `Missing fields: ${test}`})
    test = utilities.array_test(req.body.cards, "cards", /[0-9]+/)
    if(test) return res.status(400).json({error: `${test} don't match required data type!`})
    let result = await db.query(`select id from user where username = '${req.body.owner}'`)
    if(result.length === 0) {
        return res.status(404).json({error: `User ${req.body.owner} not found!`})
    }
    let owner_id = result[0].id
    if(req.body.cards.length < 60) return res.status(403).json({error: `Deck must consist at least 60 cards (provided: ${req.body.cards.length})`})
    try {
        result = await db.query(`insert into deck(name, fk_user) value ('${req.body.name}', '${owner_id}')`)
    }
    catch (e) {
        if(e.code === 'ER_DUP_ENTRY') {
            return res.status(403).json({error: `User '${req.body.owner}' already has deck named '${req.body.name}'`})
        }
        else {
            console.error(e)
        }
    }
    let deck_id = result.insertId
    let sql
    req.body.cards.forEach((e, i, arr) => {
        if(i === 0) {
            sql = `insert into deck_card(fk_deck, fk_card) values ('${deck_id}', '${e}')`
        }
        else {
            sql += `,('${deck_id}', '${e}')`
        }
    })
    try {
        await db.query(sql)
    }
    catch (e) {
        await db.query(`delete from deck where id = '${deck_id}'`)
        return res.status(403).json({error: `Cards array has ids not matching real cards!`})
    }
    res.setHeader(`Location`, `${req.protocol}://${req.get('host')}${req.originalUrl}${deck_id}`)
    return res.status(201).send(null)
})
router.patch(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from deck where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: `Deck not found!`})
    if(req.body.owner) {
        let result = await db.query(`select id from user where username = '${req.body.owner}'`)
        if(result.length === 0) return res.status(404).json({error: `User ${req.body.owner} not found!`})
        await db.query(`update deck set fk_user = '${result[0].id}' where id = '${id}'`)
    }
    if(req.body.name) {
        try {
            await db.query(`update deck set name = '${req.body.name}' where id = '${id}'`)
        }
        catch (e) {
            if(e.code === `ER_DUP_ENTRY`)
                return res.status(403).json({error: `User already has deck named like this!`})
            else
                console.error(e)
        }
    }
    if(req.body.cards) {
        let test = utilities.array_test(req.body.cards, "cards", /[0-9]+/)
        if(test) return res.status(400).json({error: `${test} don't match required data type!`})
        let max, min
        let result = await db.query(`select max(id) as max from card`)
        let max_card = result[0].max
        req.body.cards.forEach((e, i, arr) => {
            if(i === 0) {
                max = e
                min = e
            }
            else {
                if(max < e) max = e
                if(min > e) min = e
            }
        })
        if(max > max_card || min < 0) return res.status(400).json({error: `Card ids are out of rande 0 <= id <= ${max_card}`})
        if(req.body.cards.length < 60) return res.status(403).json({error: `Deck must consist at least 60 cards (provided: ${req.body.cards.length})`})
        let sql
        req.body.cards.forEach((e, i, arr) => {
            if(i === 0) {
                sql = `insert into deck_card(fk_deck, fk_card) values ('${id}', '${e}')`
            }
            else {
                sql += `,('${id}', '${e}')`
            }
        })
        await db.query(`delete from deck_card where fk_deck = '${id}'`)
        await db.query(sql)
    }
    return res.status(204).send(null)
})
router.delete(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    try {
        await db.query(`delete from deck where id = '${id}'`)
    }
    catch (e) {
        if(e.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(403).json({error: `Cant delete deck used in duel!`})
        }
    }
    return res.status(204).send(null)
})

module.exports = router