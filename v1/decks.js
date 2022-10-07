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
    test = utilities.array_test(req.body.cards, "cards", /[0-9]+/)
    if(test) return res.status(400).send(`${test} don't match required data type!`)
    let result = await db.query(`select id from user where username = '${req.body.owner}'`)
    if(result.length === 0) {
        return res.status(400).send(`User ${req.body.owner} not found!`)
    }
    let owner_id = result[0].id
    try {
        result = await db.query(`insert into deck(name, fk_user) value ('${req.body.name}', '${owner_id}')`)
    }
    catch (e) {
        if(e.code === 'ER_DUP_ENTRY') {
            return res.status(400).send(`User '${req.body.owner}' already has deck named '${req.body.name}'`)
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
        return res.status(400).send(`Cards array has ids not matching real cards!`)
    }
    return res.status(200).send(`${deck_id}`)
})
router.patch(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from deck where id = '${id}'`)
    if(result.length === 0) return res.status(400).send(`Deck not found!`)
    if(req.body.owner) {
        let result = await db.query(`select id from user where username = '${req.body.owner}'`)
        if(result.length === 0) return res.status(400).send(`User ${req.body.owner} not found!`)
        await db.query(`update deck set fk_user = '${result[0].id}' where id = '${id}'`)
    }
    if(req.body.name) {
        await db.query(`update deck set name = '${req.body.name}' where id = '${id}'`)
    }
    if(req.body.cards) {
        let test = utilities.array_test(req.body.cards, "cards", /[0-9]+/)
        if(test) return res.status(400).send(`${test} don't match required data type!`)
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
        if(max > max_card || min < 0) return res.status(400).send(`Card ids are out of rande 0 <= id <= ${max_card}`)
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
    return res.status(200).send(``)
})
router.delete(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    try {
        await db.query(`delete from deck where id = '${id}'`)
    }
    catch (e) {
        if(e.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).send(`Cant delete deck used in duel!`)
        }
    }
    return res.status(200).send(`Done`)
})

module.exports = router