const express = require('express')
const router = express.Router()
const {multi_purpose_login} = require('../controllers/login.controller.js');
const { refresh } = require('../utils/tokens.utils.js');
const { profile_addict, profile_member, logout } = require('../controllers/users.controllers.js');
const {verifyJWT} = require('../middleware/auth.middleware.js');

router.post('/login', multi_purpose_login);
router.post('/refresh', refresh);
router.get('/profile_a', verifyJWT, profile_addict);
router.get('/profile_b', verifyJWT, profile_member);
router.post('/logout', verifyJWT, logout);
module.exports = router
