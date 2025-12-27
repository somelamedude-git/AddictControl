const express = require('express');
const app = express();
require('dotenv').config()
const compression = require('compression');
const helmet = require('helmet');

app.use(express.json({
        limit: "10kb",
}));

app.use(helmet({
    referrerPolicy: {policy: 'no-referrer'},
}));

app.use(compression());

module.exports = { app };
