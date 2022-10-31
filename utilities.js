require('dotenv').config();
const crypto = require('crypto')
const jwt = require("jsonwebtoken");

function structure_test(structure, fields) {
    let bad_fields = []
    fields.forEach(element => {
        let param = structure[element]
        if(param === undefined) bad_fields.push(element)
    })
    return bad_fields.join(', ')
}
function array_test(array, name, regex) {
    try {
        let bad_fields = []
        array.forEach((e, i, arr) => {
            let s = e.toString()
            let f = s.match(regex).join()
            if(f.length !== s.length) bad_fields.push(`${name}[${i}] = ${e}`)
        })
        return bad_fields.join(', ')
    }
    catch {
        return `Field ${name} is not array`
    }
}

function hash_password(username, password) {
    return crypto.createHmac('sha256', process.env.PASSWORD_KEY)
        .update(username)
        .update(password)
        .digest('hex')
}

function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"]

    if (!token) {
        return res.status(401).json({error: `A token is required for authentication!`})
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY, {algorithms: ['HS512']})
        req.user = decoded
    }
    catch (e) {
        res.setHeader(`Location`, `${req.protocol}://${req.get('host')}/api/v1/session/new`)
        if(e.name === 'TokenExpiredError') {
            return res.status(401).json({error: `Token Expired!`})
        }
        else if(e.name === 'JsonWebTokenError') {
            return res.status(401).json({error: `Invalid Token!`})
        }
    }
    return next()
}

function adminGuard(req, res, next) {
    if(req.user.privilege === 0)
        return res.status(403).json({error: `Unauthorized!`})
    return next()
}


module.exports = {
    adminGuard,
    hash_password,
    structure_test,
    array_test,
    verifyToken,
}