const express = require('express');
const router = express.Router();
const { returnFunction, wrapAsync } = require('../../utils/utils');
const {
        saveUser,
        getUserCurrencies,
        buy
    } = require('./user.controllers');
const { validateToken } = require('../login/login.controllers');

// no token validation to register a new user
router.post('/users', wrapAsync(saveUser), returnFunction);

// rest of the APIs are checking Authorization header
router.get('/users/:userId/credits', wrapAsync(validateToken), wrapAsync(getUserCurrencies), returnFunction);

router.post('/users/:userId/buy', wrapAsync(validateToken), wrapAsync(buy), returnFunction);

module.exports = router;
