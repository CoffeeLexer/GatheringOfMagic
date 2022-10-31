const express = require("express")
const db = require("../db")
const utilities = require("../utilities");

const router = express.Router()

router.get(/\/\d+\/duels\/\d+\/decks\/\d+/, async (req, res) => {
    let split = req.url.split('/')
    let tournament_id = split[1]
    let duel_id = split[3]
    let id = split[5]
    let result = await db.query(`select * from tournament where id = '${tournament_id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result = await db.query(`select * from view_duel_final where tournament = '${tournament_id}' and id = '${duel_id}'`)
    if(result.length === 0) return res.status(404).json({error: `Duel not found`})
    let decks = JSON.parse(result[0].decks)
    if(!decks.includes(parseInt(id))) return res.status(404).json({error: `Deck not found!`})
    result = await db.query(`select * from view_deck_final where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(e.cards)
    })
    return res.status(200).json(result[0])
})
router.get(/\/\d+\/duels\/\d+\/decks/, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let split = req.url.split('/')
    let tournament_id = split[1]
    let duel_id = split[3]
    let result = await db.query(`select * from tournament where id = '${tournament_id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result = await db.query(`select * from view_duel_final where tournament = '${tournament_id}' and id = '${duel_id}'`)
    if(result.length === 0) return res.status(404).json({error: `Duel not found`})
    let decks = JSON.parse(result[0].decks)
    result = await db.query(`select * from view_deck_final where id = '${decks[0]}' or id = '${decks[1]}'`)
    result.forEach((e, i, arr) => {
        arr[i].cards = JSON.parse(e.cards)
    })
    return res.status(200).json(result)
})

module.exports = router