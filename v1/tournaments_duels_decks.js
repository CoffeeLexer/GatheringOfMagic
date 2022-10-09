const express = require("express")
const db = require("../db")
const utilities = require("../utilities");

const router = express.Router()

router.get(/\/\d+\/duels\/\d+\/decks\/\d+/, async (req, res) => {
    let split = req.url.split('/')
    let tournament_id = split[1]
    let duel_id = split[3]
    let id = split[5]
    let result = await db.query(`select * from view_tournament_full where id = '${tournament_id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    let duels = result[0].duels
    if(duels.length <= duel_id) return res.status(403).json({error:`Duel id out of range 0 <= id <= ${duels.length}`})
    let decks = duels[duel_id].decks
    if(decks.length <= id) return res.status(403).json({error:`Deck id out of range 0 <= id <= ${decks.length}`})
    return res.status(200).json(decks[id])
})
router.get(/\/\d+\/duels\/\d+\/decks/, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let split = req.url.split('/')
    let tournament_id = split[1]
    let duel_id = split[3]
    let result = await db.query(`select * from view_tournament_full where id = '${tournament_id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    let duels = result[0].duels
    if(duels.length <= duel_id) return res.status(403).json(`Duel id out of range 0 <= id <= ${duels.length}`)
    let decks = duels[duel_id].decks
    return res.status(200).json(decks.slice((page - 1) * pageSize, page * pageSize))
})

module.exports = router