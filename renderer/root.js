const express = require("express")
const url = require('url')

const router = express.Router()

router.get(/\//, async (req, res, next) => {
    res.render('index_template', {
        title: "Home Page",
        nav: 'home',
        content: "content_root",
        user: req.user,
    });
})

module.exports = router
