const express = require('express');
const router = express.Router();
const { accept_call, request_phone_call } = require('../controllers/calls.controller.js');
const {verifyJWT} = require('../middleware/auth.middleware.js');

router.get('/acceptCall',verifyJWT, accept_call);
router.get('/requestCall', verifyJWT, request_phone_call);

module.exports = router;
