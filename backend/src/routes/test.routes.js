const {givetest, submitanswer, requesttest} = require('../middleware/test.middlewares')
const express = require('express')

const router = express.Router()

router.post('/questions', givetest);
router.post('/submit', submitanswer);
router.post('/request', requesttest);

module.exports = router
