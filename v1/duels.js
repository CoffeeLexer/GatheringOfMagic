const express = require("express")
const db = require("../db");
const utilities = require("../utilities");
const url = require('url')

const router = express.Router()


//  Public access
router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_duel_final where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: "Not found"})
    result.forEach((e, i, arr) => {
        arr[i].decks = JSON.parse(e.decks)
    })
    res.status(200).json(result[0])
})

// Public access
router.get(/\//, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let result = await db.query(`select * from view_duel_final limit ${pageSize} offset ${(page - 1) * pageSize}`)
    result.forEach((e, i, arr) => {
        arr[i].decks = JSON.parse(e.decks)
    })
    res.status(200).json(result)
})

// Admin access
router.post(/\//, utilities.verifyToken, utilities.adminGuard, async (req, res) => {
    let test = utilities.structure_test(req.body, ["decks", "tournament"])
    if(test) return res.status(400).json({error: `Missing fields: ${test}`})
    test = utilities.array_test(req.body.decks, "decks", /[0-9]+/)
    if(test) return res.status(400).json({error: `${test} don't match required data type!`})
    if(req.body.decks.length !== 2) return res.status(405).json({error: `In duel only 2 decks fight (provided: ${req.body.decks.length})`})
    if(req.body.decks[0] == req.body.decks[1]) return res.status(405).json({error: `Deck can't play against itself`})
    let result = await db.query(`select * from tournament where id = '${req.body.tournament}'`)
    if(result[0].fk_organiser !== req.user.id) return res.status(403).json({error: `No ownership of tournament!`})
    if(result.length === 0) return res.status(404).json({error: `Tournament id: '${req.body.tournament}' not found`})
    if(req.body.winner) {
        let result = await db.query(`select * from deck where id = '${req.body.winner}'`)
        if(result.length === 0) return res.status(404).json({error:`Winner deck id: '${req.body.winner}' not found`})
        if(!req.body.decks.includes(req.body.winner)) return res.status(403).json({error: `Winner must be selection from 'DECKS'`})
    }
    let bad_ids = []
    for(let i = 0; i < 2; i++) {
        let result = await db.query(`select * from deck where id = '${req.body.decks[i]}'`)
        if(result.length === 0) bad_ids.push(req.body.decks[i])
    }
    if(bad_ids.length !== 0) {
        return res.status(404).json({error: `Not found decks id/ids: ${bad_ids.join(', ')}`})
    }
    {
        let result = await db.query(`select * from deck where id = '${req.body.decks[0]}'`)
        let owner_1 = result[0].fk_user
        result = await db.query(`select * from deck where id = '${req.body.decks[1]}'`)
        let owner_2 = result[0].fk_user
        if(owner_1 == owner_2) return res.status(403).json({error: `Player can't duel against itself!`})
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
    res.setHeader(`Location`, `${req.protocol}://${req.get('host')}${req.originalUrl}${id}`)
    return res.status(201).send(null)
})

// Admin access
router.patch(/\/\d+/, utilities.verifyToken, utilities.adminGuard, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from duel where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: 'Duel not found!'})
    let current_winner = result[0].fk_deck_winner

    result = await db.query(`select * from tournament where id = '${result[0].fk_tournament}'`)
    if(result[0].fk_organiser !== req.user.id) return res.status(403).json({error: `No ownership of duel`})

    if(req.body.tournament) {
        let result = await db.query(`select * from tournament where id = '${req.body.tournament}'`)
        if(result.length === 0) return res.status(404).json({error: `Tournament not found`})
        await db.query(`update duel set fk_tournament = '${req.body.tournament}' where id = '${id}'`)
    }
    if(req.body.winner && req.body.decks) {
        let result = await db.query(`select * from deck where id = '${req.body.winner}'`)
        if(result.length === 0) return res.status(404).json({error: `Winner deck not found`})
        let test = utilities.array_test(req.body.decks, "decks", /[0-9]+/)
        if(test) return res.status(400).json({error: `${test} don't match required data type!`})
        if(req.body.decks.length !== 2) return res.status(400).json({error: `In duel only 2 decks fight (provided: ${req.body.decks.length})`})
        let bad_ids = []
        for(let i = 0; i < 2; i++) {
            let result = await db.query(`select * from deck where id = '${req.body.decks[i]}'`)
            if(result.length === 0) bad_ids.push(req.body.decks[i])
        }
        if(bad_ids.length !== 0) {
            return res.status(404).json({json :`Not found decks id/ids: ${bad_ids.join(', ')}`})
        }
        if(req.body.decks[0] == req.body.decks[1]) return res.status(403).json({error: `Deck can't play against itself`})
        {
            let result = await db.query(`select * from deck where id = '${req.body.decks[0]}'`)
            let owner_1 = result[0].fk_user
            result = await db.query(`select * from deck where id = '${req.body.decks[1]}'`)
            let owner_2 = result[0].fk_user
            if(owner_1 == owner_2) return res.status(403).json({error: `Player can't duel against itself!`})
        }
        if(!req.body.decks.includes(req.body.winner)) return res.status(403).json({error: `Winner must be selection from 'DECKS'`})
        await db.query(`delete from duel_deck where fk_duel = '${id}'`)
        await db.query(`insert into duel_deck(fk_duel, fk_deck) values ('${id}', '${req.body.decks[0]}'), ('${id}', '${req.body.decks[1]}')`)
        await db.query(`update duel set fk_deck_winner = '${req.body.winner}' where id = '${id}'`)
    }
    if(req.body.winner && !req.body.decks) {
        let result = await db.query(`select * from deck where id = '${req.body.winner}'`)
        if(result.length === 0) return res.status(404).json({error: `Winner deck not found`})
        result = await db.query(`select * from duel_deck where fk_duel = '${id}'`)
        let found = false
        result.forEach(e => {
            if(e.fk_deck === req.body.winner) found = true
        })
        if(!found) return res.status(403).json({error: `Winner must be selection from 'DECKS'`})
        await db.query(`update duel set fk_deck_winner = '${req.body.winner}' where id = '${id}'`)
    }
    if(!req.body.winner && req.body.decks) {
        let test = utilities.array_test(req.body.decks, "decks", /[0-9]+/)
        if(test) return res.status(400).json({error: `${test} don't match required data type!`})
        if(req.body.decks.length !== 2) return res.status(400).json({error: `In duel only 2 decks fight (provided: ${req.body.decks.length})`})
        let bad_ids = []
        for(let i = 0; i < 2; i++) {
            let result = await db.query(`select * from deck where id = '${req.body.decks[i]}'`)
            if(result.length === 0) bad_ids.push(req.body.decks[i])
        }
        if(bad_ids.length !== 0) {
            return res.status(404).json({json :`Not found decks id/ids: ${bad_ids.join(', ')}`})
        }
        if(req.body.decks[0] == req.body.decks[1]) return res.status(403).json({error: `Deck can't play against itself`})
        {
            let result = await db.query(`select * from deck where id = '${req.body.decks[0]}'`)
            let owner_1 = result[0].fk_user
            result = await db.query(`select * from deck where id = '${req.body.decks[1]}'`)
            let owner_2 = result[0].fk_user
            if(owner_1 == owner_2) return res.status(403).json({error: `Player can't duel against itself!`})
        }
        if(!req.body.decks.includes(current_winner)) return res.status(403).json({error: `Winner must be selection from 'DECKS'`})
        await db.query(`delete from duel_deck where fk_duel = '${id}'`)
        await db.query(`insert into duel_deck(fk_duel, fk_deck) values ('${id}', '${req.body.decks[0]}'), ('${id}', '${req.body.decks[1]}')`)
    }
    return res.status(204).send(null)
})

//  Admin access
router.delete(/\/\d+/, utilities.verifyToken, utilities.adminGuard, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from duel where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: `Duel not found!`})

    result = await db.query(`select * from tournament where id = '${result[0].fk_tournament}'`)
    if(result[0].fk_organiser !== req.user.id) return res.status(403).json({error: `No ownership rights of duel!`})

    await db.query(`delete from duel where id = '${id}'`)

    return res.status(204).send(null)
})

module.exports = router