const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\/\d+\/patch/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/tournaments${req.url}`
    const resTournament = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    url += '/duels'
    const resDuels = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    let tournament = await resTournament.json()

    res.render('index_template', {
        title: "Editing Tournament",
        nav: 'tournaments',
        content: "content_tournaments_patch",
        url: url,
        current: tournament,
        user: req.user,
        token: req.token,
    })
})

router.get(/\/\d+/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/tournaments${req.url}`
    const resTournament = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    url += '/duels'
    const resDuels = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    let tournament = await resTournament.json()
    let duels = await resDuels.json()

    for(let i = 0; i < duels.length; i++) {
        let e = duels[i]
        const result = await fetch(url + '/' + e.id + '/decks' , {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        duels[i].details = await result.json()
    }


    res.render('index_template', {
        title: tournament.location,
        nav: 'tournaments',
        content: "content_tournaments_single",
        url: url,
        tournament: tournament,
        user: req.user,
        token: req.token,
        duels: duels
    })
})

router.get(/\/post/, async (req, res, next) => {
    res.render('index_template', {
        title: "Creating Tournament",
        nav: 'tournaments',
        content: "content_tournaments_post",
        user: req.user,
    });
})

router.post(/\/post/, async (req, res, next) => {
    let url = `${req.protocol}://${req.get('host')}/api/v1/tournaments`
    const resTournament = await fetch(url , {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "x-access-token": req.cookies["x-access-token"]},
        body: JSON.stringify(req.body)
    });

    if(resTournament.status === 201) {
        const l = resTournament.headers.get('location')
        const id = l.substring(l.lastIndexOf('/') + 1)
        return res.redirect(`/tournaments/${id}`)
    }
    else {
        res.render('index_template', {
            title: "Error",
            nav: 'tournaments',
            content: "content_tournaments_post",
            user: req.user,
        });
    }
})

router.get(/\//, async (req, res, next) => {
    const page = req.query.page && req.query.page > 0 ? req.query.page : 1
    const pageSize = req.query.pageSize && req.query.pageSize > 0 ? req.query.pageSize : 100

    if(req.query.page === undefined || req.query.pageSize === undefined) {
        res.writeHead(302, {
            'Location': `tournaments?page=${page}&pageSize=${pageSize}`
        })
        return res.end()
    }

    let url = `${req.protocol}://${req.get('host')}/api/v1/tournaments${req.url}`
    const response = await fetch(url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        qs: req.query
    });
    res.render('index_template', {
        title: "Tournament list",
        nav: 'tournaments',
        content: "content_tournaments",
        user: req.user,
        tournaments: await response.json(),
    });
})

module.exports = router
