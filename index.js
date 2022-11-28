const path = require('path')
const utilities = require('./utilities')
const express = require('express')
const app = express()
const port = 8080

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, '/front_end/ejs'));
app.set('view engine', 'ejs')

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
// download()

app.all(/.*/, utilities.parseToken)

app.get('/assets/*(.png|.jpg|.svg)', (req, res) => {
    let fileName = req.url.substring(req.url.lastIndexOf('/') + 1)
    res.sendFile(path.join(__dirname, `/front_end/assets/${fileName}`))
})
app.get('/styles/*.css', (req, res) => {
    let fileName = req.url.substring(req.url.lastIndexOf('/') + 1)
    res.sendFile(path.join(__dirname, `/front_end/css/${fileName}`))
})
app.get('/assets/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, `/front_end/assets/Vector_Logo.png}`))
})


app.use('/api/v1', require('./v1/master'))
app.use('/', require('./renderer/master'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})