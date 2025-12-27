const express = require('express')
const router = express.Router()
const {multi_purpose_login} = require('../controllers/login.controller.js');

router.post('/login', multi_purpose_login);

module.exports = router
