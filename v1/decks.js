const express = require("express")

const router = express.Router()

router.get(/\/\d+/, async (req, res) => {
    res.send('X')
})
router.get(/\//, async (req, res) => {
    res.send('Hi!')
})
router.post(/\//, async (req, res) => {
})
router.put(/\//, async (req, res) => {
})
router.patch(/\//, async (req, res) => {
})
router.delete(/\//, async (req, res) => {
})

module.exports = router