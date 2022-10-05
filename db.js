const mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit:4,
    host: "localhost",
    user: "root",
    password: "",
    database: "magic"
})

module.exports.query = async (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, result) => {
            if(error) reject(error)
            resolve(result)
        })
    })
}