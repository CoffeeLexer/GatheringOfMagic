const express = require("express")
const db = require("../db");
const utilities = require("../utilities");

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
    let test = utilities.structure_test(req.body, ["decks", "tournament"])
    if(test) return res.status(400).send(`Missing fields: ${test}`)
    test = utilities.array_test(req.body.decks, "decks", /[0-9]+/)
    if(test) return res.status(400).send(`${test} don't match required data type!`)
    if(req.body.decks.length !== 2) return res.status(400).send(`In duel only 2 decks fight (provided: ${req.body.decks.length})`)
    let result = await db.query(`select * from tournament where id = '${req.body.tournament}'`)
    if(result.length === 0) return res.status(400).send(`Tournament id: '${req.body.tournament}' not found`)
    if(req.body.winner) {
        let result = await db.query(`select * from deck where id = '${req.body.winner}'`)
        if(result.length === 0) return res.status(400).send(`Winner deck id: '${req.body.winner}' not found`)
    }
    let bad_ids = []
    for(let i = 0; i < 2; i++) {
        let result = await db.query(`select * from deck where id = '${req.body.decks[i]}'`)
        if(result.length === 0) bad_ids.push(req.body.decks[i])
    }
    if(bad_ids.length !== 0) {
        return res.status(400).send(`Not found decks id/ids: ${bad_ids.join(', ')}`)
    }
    if(req.body.winner) {
        result = await db.query(`insert into duel(fk_deck_winner, fk_tournament) value ('${req.body.winner}', '${req.body.tournament}')`)
    }
    else {
        result = await db.query(`insert into duel(fk_tournament) value ('${req.body.tournament}')`)
    }
    let id = result.insertId
    for(let i = 0; i < 2; i++) {
        await db.query(`insert into duel_deck(fk_duel, fk_deck) value ('${id}', '${req.body.decks[i]}')`)
    }
    return res.status(200).send(`${id}`)
})
router.patch(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from duel where id = '${id}'`)
    if(result.length === 0) return res.status(400).send('Duel not found!')
    if(req.body.tournament) {
        let result = await db.query(`select * from tournament where id = '${req.body.tournament}'`)
        if(result.length === 0) return res.status(400).send(`Tournament not found`)
        await db.query(`update duel set fk_tournament = '${req.body.tournament}' where id = '${id}'`)
    }
    if(req.body.winner) {
        let result = await db.query(`select * from deck where id = '${req.body.winner}'`)
        if(result.length === 0) return res.status(400).send(`Winner deck not found`)
        await db.query(`update duel set fk_deck_winner = '${req.body.winner}' where id = '${id}'`)
    }
    if(req.body.decks) {
        let test = utilities.array_test(req.body.decks, "decks", /[0-9]+/)
        if(test) return res.status(400).send(`${test} don't match required data type!`)
        if(req.body.decks.length !== 2) return res.status(400).send(`In duel only 2 decks fight (provided: ${req.body.decks.length})`)
        let bad_ids = []
        for(let i = 0; i < 2; i++) {
            let result = await db.query(`select * from deck where id = '${req.body.decks[i]}'`)
            if(result.length === 0) bad_ids.push(req.body.decks[i])
        }
        if(bad_ids.length !== 0) {
            return res.status(400).send(`Not found decks id/ids: ${bad_ids.join(', ')}`)
        }
        await db.query(`delete from duel_deck where fk_duel = '${id}'`)
        await db.query(`insert into duel_deck(fk_duel, fk_deck) values ('${id}', '${req.body.decks[0]}'), ('${id}', '${req.body.decks[1]}')`)
    }
    return res.status(200).send(``)
})
router.delete(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    await db.query(`delete from duel where id = '${id}'`)
    return res.status(200).send(`Done`)
})

module.exports = router