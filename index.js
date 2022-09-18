
const express = require('express')
const app = express();
const cookie_parser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookie_parser)

