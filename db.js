require('dotenv').config();
const mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit:4,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
})

module.exports.query = async (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, result) => {
            if(error) reject(error)
            resolve(result)
        })
    })
}