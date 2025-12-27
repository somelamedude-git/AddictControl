const {givetest, submitanswer, requesttest, storetest} = require('../middleware/test.middlewares')
const express = require('express')
const {fetch_past_results} = require('../controllers/test.controller.js');
const {verifyJWT} = require('../middleware/auth.middleware.js');
const router = express.Router()

router.post('/questions', verifyJWT, givetest);
router.post('/submit',verifyJWT, submitanswer);
router.post('/request', requesttest);
router.post('/store',verifyJWT, storetest)
router.get('/see_results', verifyJWT, fetch_past_results);

module.exports = router;
