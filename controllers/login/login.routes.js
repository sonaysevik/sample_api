const express = require('express');
const router = express.Router();
const { returnFunction, wrapAsync } = require('../../utils/utils');
const {
        login
    } = require('./login.controllers');

router.post('/login', wrapAsync(login), returnFunction);


module.exports = router;
