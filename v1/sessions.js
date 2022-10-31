const express = require("express")
const db = require("../db")
const utilities = require("../utilities");
const url = require('url')
const jwt = require('jsonwebtoken')
const jose = require('jose')


const router = express.Router()

//  Login
router.post(/\//, async (req, res) => {
    let test = utilities.structure_test(req.body, ["username", "password"])
    if(test) return res.status(400).json({error: `Missing fields: ${test}`})
    const {username, password} = req.body
    let hashed_password = utilities.hash_password(username, password)
    let result = await db.query(`select * from user where username = '${username}'`)
    if(result.length === 0) return res.status(404).json({error: `User not found`})
    let user = result[0]
    console.log(hashed_password)
    if(user.password !== hashed_password) return res.status(405).json({error:`Incorrect credentials!`})
    user.password = undefined

    user.token = jwt.sign(
        {id: user.id, username: user.username, privilege: user.privilege},
        process.env.TOKEN_KEY,
        {expiresIn: 60 * 60, algorithm: 'HS512'})
    await db.query(`update user set token = '${user.token}'`)
    res.setHeader('x-access-token', user.token)
    return res.status(201).json(user)
})
router.delete(/\//, utilities.verifyToken, async (req, res) => {
    await db.query(`update user set token = ''`)
    res.setHeader('x-access-token', null)
    return res.status(204).send(null)
})

module.exports = router