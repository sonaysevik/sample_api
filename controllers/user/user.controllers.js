const Users = require('../../models/users');
const Currency = require('../../models/currencies');
const UserCredits = require('../../models/user_credits');
const CustomError = require('../../utils/error');
const statusCodes = require('http-status-codes');
const { commissionRate } = require('../../utils/constants');
const logger = require('../../utils/logger');
const bcrypt = require('bcrypt');
const Currencies = require('../../models/currencies');
const {
        getToCurrencyObject,
        getUserCredit
    } = require('./userUtils');
const saltRounds = 10;

let schemaValidator = require('jsonschema').Validator;
validator = new schemaValidator();

// user object schema to validate the request body
const userSchema = {
    "type": "object",
    "properties": {
        "name": { 
            "type": "string",
            "minLength": 1
        },
        "surname": { 
            "type": "string",
            "minLength": 1
        },
        "email": { 
            "type": "string",
            "format": "email"
        },
        "password": { 
            "type": "string",
            "minLength": 1
        }
    },
    "required": [
        "name",
        "surname",
        "email",
        "password"
    ]
  };

// object schema to validate request body for buy API
const buySchema = {
    "type": "object",
    "properties": {
        "fromCurrencyId": { 
            "type": "number"
        },
        "toCurrencyId": {
            "type": "number"
        },
        "fromCurrencyAmount": {
            "type": "number"
        }
    },
    "required": [
        "fromCurrencyId",
        "toCurrencyId",
        "fromCurrencyAmount"
    ]
}

const saveUser = async (req, res, next) => {
    logger.info('Save user starts.');
    const userObj = req.body.user;
    const validationResult = validator.validate(userObj, userSchema);
    if(!validationResult.valid) {
        throw new CustomError( `User API request validation failed. ${validationResult.errors.join(',')}`,
                                statusCodes.BAD_REQUEST,
                                validationResult.errors);
    }
    // dont save same email twice via following logic
    const existingUser = await Users.findAll({
        where: {
            email: userObj.email
        }
    });
    if(existingUser.length > 0) {
        throw new CustomError( `User email should be unique.`,
                            statusCodes.CONFLICT,
                            validationResult.errors);
    }
    // add default credit
    const xrp = await Currencies.findOne({
                                            where: {
                                                name: 'XRP'
                                            }
                                        });

    // a check for existing email could have been good for here.
    // But for time's sake I dont add it for now.
    const hashedPass = await bcrypt.hash(userObj.password, saltRounds);
    userObj.password = hashedPass;
    const newUser = await Users
                        .build(userObj)
                        .save();
    delete newUser.dataValues.password;

    const userCredit = await UserCredits.build({
        currency_id: xrp.id,
        amount: 1000,
        user_id: newUser.id
    }).save();
    
    res.res = {
        body: {
            newUser,
            userCredit
        },
        statusCode: statusCodes.CREATED
    };
    next();
};

const getUserCurrencies = async (req, res, next) => {
    logger.info('Get user credits operation starts');
    const userCredits = await UserCredits.findAll({
        where: {
            user_id: req.params.userId
        },
        include: {
            model: Currency,
            as: 'currency'
        }
    })
    
    res.res = {
        body: {
            userCredits
        },
        statusCode: statusCodes.OK
    };
    next();

};

const buy = async (req, res, next) => {
    // first validate body schema
    const buyObj = req.body;
    const validationResult = validator.validate(buyObj, buySchema);
    if(!validationResult.valid) {
        throw new CustomError( `Request body validation failed. ${validationResult.errors.join(',')}`,
                                statusCodes.BAD_REQUEST,
                                validationResult.errors);
    }
    // Get user's existing credit in from currency
    const userCreditFrom = await getUserCredit(req.params.userId, req.body.fromCurrencyId);
    if(!userCreditFrom) {
        throw CustomError( `User doesnt have any credit in currency yet.`,
                            statusCodes.BAD_REQUEST,
                            {});
    } 
    // check if user has enough balance
    if( req.body.fromCurrencyAmount > userCreditFrom.amount) {
    throw new CustomError( `User doesnt have enough credit in currency.`,
                            statusCodes.BAD_REQUEST,
                            {});
    }
    // get the to currency object 
    const toCurrency = await getToCurrencyObject(req.body.toCurrencyId);
    let userCreditTo = await getUserCredit(req.params.userId, req.body.toCurrencyId);
    
    let existingAmountInBTC = req.body.fromCurrencyAmount * userCreditFrom.currency.value;
    // deduct comission
    existingAmountInBTC *= (1- commissionRate);
    const equivalentInToCurrency = existingAmountInBTC/ toCurrency.value;
    // save the user object in from currency
    userCreditFrom.amount -= req.body.fromCurrencyAmount;
    await userCreditFrom.save();

    // if there is no creadit yet in the new currency create
    // if there is update
    if(userCreditTo) {
        userCreditTo.amount += equivalentInToCurrency;
        await userCreditTo.save();
    } else {
        userCreditTo = await UserCredits.build({
                            user_id: req.params.userId,
                            currency_id: req.body.toCurrencyId,
                            amount: equivalentInToCurrency
                        })
                        .save();
    }
    res.res = {
        body: {
            userCreditFrom,
            userCreditTo
        },
        statusCode: statusCodes.OK
    };
    next();
    return;
    

};

module.exports = {
    saveUser,
    getUserCurrencies,
    buy
};