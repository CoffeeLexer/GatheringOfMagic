const express = require("express")
const db = require("../db")
const utilities = require("../utilities");

const router = express.Router()

router.get(/\/\d+\/duels\/\d+/, async (req, res) => {
    let split = req.url.split('/')
    let tournament_id = split[1]
    let id = split[3]
    let result = await db.query(`select * from view_tournament_full where id = '${tournament_id}'`)
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    let duels = result[0].duels
    if(duels.length <= id) return res.status(400).send(`Id out of range`)
    else return res.json(duels[id])
})

router.get(/\/\d+\/duels\//, async (req, res) => {
    let split = req.url.split('/')
    let id = split[1]
    let result = await db.query(`select * from view_tournament_full where id = '${id}'`)
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    return res.json(result[0].duels)
})

module.exports = router