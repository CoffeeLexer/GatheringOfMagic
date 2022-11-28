const express = require("express")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const router = express.Router()

router.get(/\//, async (req, res, next) => {
    res.render('index_template', {
        title: "User Registration",
        nav: 'sessions',
        content: "content_users"
    });
})

router.post(/\//, async (req, res, next) => {
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)

    });

    if(response.status === 201) {
        return res.redirect('/sessions')
    }

    return res.render('index_template', {
        title: "User Registration",
        nav: 'sessions',
        error: "Username in use!",
        content: "content_users"
    });
})

module.exports = router
