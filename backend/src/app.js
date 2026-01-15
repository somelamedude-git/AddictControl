const express = require('express');
const app = express();
require('dotenv').config()
const compression = require('compression');
const helmet = require('helmet');
const { authGlobal } = require('./middleware/auth.middleware.js');

app.use(express.json({
        limit: "10kb",
}));

app.use(helmet({
    referrerPolicy: {policy: 'no-referrer'},
}));

app.use(express.urlencoded({extended: true, limit: "10kb"}));

app.use(compression());

app.use(authGlobal);

module.exports = { app };
