const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\/\d+\/duels\/post/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/decks`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        qs: req.query
    });

    res.render('index_template', {
        title: "Create Duel",
        nav: 'tournaments',
        content: "content_duels_post",
        user: req.user,
        token: req.token,
        decks: await response.json(),
    });
})

module.exports = router
