const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\/\d+\/patch/, async (req, res, next) => {
    let segments = req.url.split('/')
    let url = `${req.protocol}://${req.get('host')}/api/v1/decks/${segments[1]}`
    let response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    let deck = await response.json()
    deck.cardsDetailed = []
    url = `${req.protocol}://${req.get('host')}/api/v1/cards/`
    for(let i = 0; i < deck.cards.length; i++) {
        const response = await fetch(url + deck.cards[i] , {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        deck.cardsDetailed.push(await response.json())
    }
    deck.cards = deck.cardsDetailed
    deck.cardsDetailed = undefined

    url = `${req.protocol}://${req.get('host')}/api/v1/cards?pageSize=1000`
    response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let cards =  await response.json()

    res.render('index_template', {
        title: deck.name,
        nav: 'decks',
        content: "content_decks_patch",
        user: req.user,
        cards: cards,
        deck: deck,
        token: req.token
    });
})

router.get(/\/\d+/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/decks${req.url}`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    let deck = await response.json()
    deck.cardsDetailed = []
    url = `${req.protocol}://${req.get('host')}/api/v1/cards/`
    for(let i = 0; i < deck.cards.length; i++) {
        const response = await fetch(url + deck.cards[i] , {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        deck.cardsDetailed.push(await response.json())
    }
    deck.cards = deck.cardsDetailed
    deck.cardsDetailed = undefined
    res.render('index_template', {
        title: deck.name,
        nav: 'decks',
        content: "content_decks_single",
        user: req.user,
        token: req.token,
        deck: deck
    });
})

router.get(/\/post/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/cards?pageSize=1000`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    res.render('index_template', {
        title: "Create New Deck",
        nav: 'decks',
        content: "content_decks_post",
        user: req.user,
        cards: await response.json(),
        token: req.token
    });
})

router.get(/\//, async (req, res, next) => {
    const page = req.query.page && req.query.page > 0 ? req.query.page : 1
    const pageSize = req.query.pageSize && req.query.pageSize > 0 ? req.query.pageSize : 100

    if(req.query.page === undefined || req.query.pageSize === undefined) {
        res.writeHead(302, {
            'Location': `decks?page=${page}&pageSize=${pageSize}`
        })
        return res.end()
    }

    let url = `${req.protocol}://${req.get('host')}/api/v1/decks${req.url}`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        qs: req.query
    });

    res.render('index_template', {
        title: "Deck list",
        nav: 'decks',
        content: "content_decks",
        user: req.user,
        decks: await response.json(),
    });
})

module.exports = router
