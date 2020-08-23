const express = require('express');
const router = express.Router();
const { returnFunction, wrapAsync } = require('../../utils/utils');
const {
        listCurrencies
    } = require('./currency.controllers');
const {
    validateToken
    } = require('../login/login.controllers');

// Authorization header validation exists
router.get('/currencies', wrapAsync(validateToken), wrapAsync(listCurrencies), returnFunction);


module.exports = router;
