const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const mtg = require('mtgsdk')

mtg.card.find(386616)
    .then(result => {
        console.log(result.card.imageUrl)
    })

app.use('/api/v1', require('./v1/master'))




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})