const express = require("express")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const router = express.Router()

router.get(/\//, async (req, res, next) => {
    res.render('index_template', {
        title: "Login",
        nav: 'sessions',
        content: "content_sessions"
    });
})

router.post(/\//, async (req, res, next) => {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/v1/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)

    });

    if(response.status === 201) {
        const body = await response.json();
        res.setHeader('x-access-token', body.token)
        res.cookie('x-access-token', body.token)
        return res.redirect('/')
    }

    return res.render('index_template', {
        title: "Error",
        nav: 'sessions',
        error: "Invalid credentials!",
        content: "content_sessions"
    });
})

router.delete(/\//, async (req, res, next) => {
    res.cookie('x-access-token', undefined)
    return res.redirect('/')
})

module.exports = router
