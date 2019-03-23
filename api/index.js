const express = require('express')
const bootstrapAuth = require('./modules/bootstrap')

const apiRouter = express.Router();

// Bootstrap API
bootstrapAuth(apiRouter);

module.exports = apiRouter;
