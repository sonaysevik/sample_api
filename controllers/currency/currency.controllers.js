const Currency = require('../../models/currencies');
const logger = require('../../utils/logger');
const statusCodes = require('http-status-codes');

const listCurrencies = async (req, res, next) => {
    logger.info('Listing Currencies started.');
    const currencies = await Currency.findAll();
    res.res = {
        body: {
            currencies
        },
        statusCode: statusCodes.OK
    }
    next();
    return;
};

module.exports = {
    listCurrencies
};