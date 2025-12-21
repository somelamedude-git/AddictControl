const express = require('express')
const router = express.Router()
const {login} = require('../middleware/auth.middlewares')

router.post('/login', login)

module.exports = router