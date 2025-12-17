const {givetest} = require('../middleware/test.middlewares')
const express = require('express')

const router = express.Router()

router.get('/questions', givetest);

module.exports = router
