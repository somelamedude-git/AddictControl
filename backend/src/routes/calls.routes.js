const express = require('express');
const router = express.Router();
const { accept_call } = require('../controllers/calls.controller.js');

router.get('/acceptCall', accept_call);

module.exports = router;
