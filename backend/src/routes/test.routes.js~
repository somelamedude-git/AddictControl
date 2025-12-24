const {givetest, submitanswer, requesttest, storetest} = require('../middleware/test.middlewares')
const express = require('express')

const router = express.Router()

router.post('/questions', givetest);
router.post('/submit', submitanswer);
router.post('/request', requesttest);
router.post('/store', storetest)

module.exports = router
