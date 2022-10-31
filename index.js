const express = require('express')
const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./db')
const mtg = require('mtgsdk')

async function download() {
    for(let i = 0; i < 710; i++) {
        mtg.card.where({page:i})
            .then(cards => {
                let sql = ""
                for(let j = 0; j < cards.length; j++) {
                    let id = i * 100 + j
                    cards[j].foreignNames = undefined;
                    cards[j].rulings = undefined;
                    let content = Buffer.from(JSON.stringify(cards[j])).toString('base64')
                    if(j === 0) {
                        sql += `insert ignore into card(id, content) values ('${id}', '${content}')`
                    }
                    else {
                        sql += `,('${id}', '${content}')`
                    }
                }
                db.query(sql)
            })
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
//download()

app.use('/api/v1', require('./v1/master'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})