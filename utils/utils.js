const logger = require('../utils/logger');
const CustomError = require('../utils/error');
const Sequelize = require('sequelize');
const statusCodes = require('http-status-codes');

const returnFunction = (req, res) => {
    res.status(res.res.statusCode);
    res.send(res.res.body);
    return;
}

// Wrapper function for middlewares to catch exceptions 
// and send to error middleware
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
      };
};

// Error handler for async middlewares
const errorHandler = (error, req, res, next) => {
    logger.error(error);
    if(error instanceof CustomError) {
        const body = {
            error: error.message
        };
        res.status(error.statusCode);
        res.send(body);
        return;
    }
    const body = {
        error: error.message
    };
    res.status(statusCodes.INTERNAL_SERVER_ERROR);
    res.send(body);
    return;
}


module.exports = {
    returnFunction,
    wrapAsync,
    errorHandler
};