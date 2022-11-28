const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\/\d+/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/cards${req.url}`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let card = (await response.json()).card
    res.render('index_template', {
        title: card.name,
        nav: 'cards',
        content: "content_cards_single",
        user: req.user,
        card: card,
    });
})

router.get(/\//, async (req, res, next) => {
    const page = req.query.page && req.query.page > 0 ? req.query.page : 1
    const pageSize = req.query.pageSize && req.query.pageSize > 0 ? req.query.pageSize : 1000

    if(req.query.page === undefined || req.query.pageSize === undefined) {
        res.writeHead(302, {
            'Location': `cards?page=${page}&pageSize=${pageSize}`
        })
        return res.end()
    }

    let url = `${req.protocol}://${req.get('host')}/api/v1/cards${req.url}`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        qs: req.query
    });

    res.render('index_template', {
        title: "Card list",
        nav: 'cards',
        content: "content_cards",
        user: req.user,
        cards: await response.json(),
    });
})

module.exports = router
