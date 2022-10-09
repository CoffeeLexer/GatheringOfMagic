const express = require("express")
const db = require("../db")
const utilities = require("../utilities");
const url = require('url')

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from view_tournament_full where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({"error": `Not found`})
    result.forEach((e, i, arr) => {
        arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result[0])
})
router.get(/\//, async (req, res) => {
    const parsed_url = new URL("http://localhost" + req.originalUrl)
    const params = parsed_url.searchParams
    const page = params.get('page') && params.get('page') > 0 ? params.get('page') : 1
    const pageSize = params.get('pageSize') && params.get('pageSize') > 0 ? params.get('pageSize') : 10
    let result = await db.query(`select * from view_tournament_full limit ${pageSize} offset ${(page - 1) * pageSize}`)
    result.forEach((e, i, arr) => {
        if(e.duels) arr[i].duels = JSON.parse(e.duels.replace(/%1/g, '\'').replace(/%2/g, '"').replace(/\n/g, ''))
    })
    res.status(200).json(result)
})
router.post(/\//, async (req, res) => {
    let test = utilities.structure_test(req.body, ["organiser", "location"])
    if(test) return res.status(400).json({error: `Missing fields: ${test}`})
    let result = await db.query(`select id from user where username = '${req.body.organiser}'`)
    if(result.length === 0) return res.status(404).json({error: `User ${req.body.organiser} not found!`})
    result = await db.query(`insert into tournament(fk_organiser, location) value ('${result[0].id}', '${req.body.location}')`)
    res.setHeader(`Location`, `${req.protocol}://${req.get('host')}${req.originalUrl}${result.insertId}`)
    return res.status(201).send(null)
})
router.patch(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    let result = await db.query(`select * from tournament where id = '${id}'`)
    if(result.length === 0) return res.status(404).json({error: `Tournament not found!`})
    if(req.body.organiser) {
        let result = await db.query(`select id from user where username = '${req.body.organiser}'`)
        if(result.length === 0) return res.status(404).json({error: `User ${req.body.organiser} not found!`})
        await db.query(`update tournament set fk_organiser = '${result[0].id}' where id = '${id}'`)
    }
    if(req.body.location) {
        await db.query(`update tournament set location = '${req.body.location}' where id = '${id}'`)
    }
    return res.status(204).send(null)
})
router.delete(/\/\d+/, async (req, res) => {
    let id = req.url.substring(req.url.indexOf('/') + 1)
    try {
        await db.query(`delete from tournament where id = '${id}'`)
    }
    catch (e) {
        if(e.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(403).json({error: `Cant delete tournament with duels!`})
        }
    }
    return res.status(203).send(null)
})

module.exports = router