const express = require("express")
const db = require("../db")
const utilities = require("../utilities");

const router = express.Router()

router.get(/\/\d+\/duels\/\d+/, async (req, res) => {
    let split = req.url.split('/')
    let tournament_id = split[1]
    let id = split[3]
    let result = await db.query(`select * from tournament where id = '${tournament_id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result = await db.query(`select * from view_duel_final where tournament = '${tournament_id}' and id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: `Duel not found`})
    result.forEach((e, i, arr) => {
        arr[i].decks = JSON.parse(e.decks)
    })
    return res.status(200).json(result[0])
})
router.get(/\/\d+\/duels/, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let split = req.url.split('/')
    let id = split[1]
    let result = await db.query(`select * from tournament where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Tournament not found`})
    result = await db.query(`select * from view_duel_final where tournament = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].decks = JSON.parse(e.decks)
    })
    return res.status(200).json(result)
})


module.exports = router