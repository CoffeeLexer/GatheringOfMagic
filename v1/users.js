const express = require("express")
const db = require("../db")
const utilities = require("../utilities");
const url = require('url')
const jwt = require("jsonwebtoken");

const router = express.Router()

router.post(/\//, async (req, res) => {
    let test = utilities.structure_test(req.body, ["username", "password"])
    if(test) return res.status(400).json({error: `Missing fields: ${test}`})
    const {username, password} = req.body
    let hashed_password = utilities.hash_password(username, password)
    let result
    try {
        result = await db.query(`insert into user(username, password) value('${username}', '${hashed_password}')`)
    }
    catch (e) {
        if(e.code === 'ER_DUP_ENTRY') return res.status(405).json({error: `Username is already taken!`})
        throw e
    }
    res.setHeader(`Location`, `${req.protocol}://${req.get('host')}/sessions/`)
    return res.status(201).send(null)
})

module.exports = router