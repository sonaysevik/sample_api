const Users = require('../../models/users');
const Tokens = require('../../models/tokens');
const { Op } = require("sequelize");
const logger = require('../../utils/logger');
const { disableAuth } = require('../../utils/constants');
const bcrypt = require('bcrypt');
const CustomError = require('../../utils/error');
const statusCodes = require('http-status-codes');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');




const login = async (req, res, next) => {
    logger.info('Login operation starts.');
    const userObj = req.body;
    const user = await Users.findOne({
        where: {
            email: userObj.email
        }
    });
    if(!user) {
        throw new CustomError( `No user found.`,
                                statusCodes.NOT_FOUND,
                                {});
    }
    const match = await bcrypt.compare(userObj.password, user.password);

    if(match) {
        const token = uuidv4();
        // token expires in 24 hours
        const expiresAt = Math.floor(new Date().getTime()/1000) + (24 * 60 * 60);
        const tokenObj = await Tokens.build({
                                                user_id: user.id,
                                                token: token,
                                                expires_at: expiresAt
                                            }).save();
        res.res = {
            body: {
                token: tokenObj
            },
            statusCode: statusCodes.OK
        };
        next();
        return;
    } else {
        throw new CustomError( `No user found.`,
                                            statusCodes.NOT_FOUND,
                                            {});
    }
    
    
};

const validateToken = async (req, res, next) => {
    logger.info('Token validation starts.');
    // config to disable Auth
    if(disableAuth) {
        next();
        return;
    }
    const authHeader = req.header('Authorization');
    if(!authHeader) {
        throw new CustomError('Auth header is required.',
                                statusCodes.UNAUTHORIZED,
                                {});
    }
    const parsedHeader = authHeader.split(' ');
    const currentEpoch = Math.floor(new Date().getTime()/1000);
    const tokenObj = await Tokens.findOne({
        where: {
            token: parsedHeader[1],
            expires_at: {
                [Op.gt]: currentEpoch, 
            }
        }
    });
    if(!tokenObj) {
        throw new CustomError('Token is not valid.',
                                statusCodes.UNAUTHORIZED,
                                {});
    }
    req.user = {
        userId: tokenObj.user_id
    };
    next();
    
    


};

module.exports = {
    login,
    validateToken
};