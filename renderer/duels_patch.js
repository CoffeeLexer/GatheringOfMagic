const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\/\d+\/patch/, async (req, res, next) => {
    let id = req.url.split('/')[1]
    let url = `${req.protocol}://${req.get('host')}/api/v1/decks`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        qs: req.query
    });

    const currentResponse = await fetch(`${req.protocol}://${req.get('host')}/api/v1/duels/${id}`)
    const current = await currentResponse.json()
    res.render('index_template', {
        title: "Editing Duel",
        nav: 'tournaments',
        content: "content_duels_patch",
        user: req.user,
        token: req.token,
        decks: await response.json(),
        current: current
    });
})

module.exports = router
