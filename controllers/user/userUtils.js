const CustomError = require('../../utils/error');
const Currency = require('../../models/currencies');
const UserCredits = require('../../models/user_credits');

const getToCurrencyObject = async (toCurrencyId) =>{
    const toCurrency = await Currency.findOne({
        where: {
            id: toCurrencyId
        }
    });
    if(!toCurrency) {
        throw new CustomError( `Missing currency to convert.`,
                                        statusCodes.BAD_REQUEST,
                                        {});
    }
    return toCurrency;
}

const getUserCredit = async (userId, currencyId) => {
    const userCredit = await UserCredits.findOne({
        where: {
            user_id: userId,
            currency_id: currencyId
        },
        include: {
            model: Currency,
            as: 'currency'
        }
    });
    return userCredit;
}

module.exports = {
    getToCurrencyObject,
    getUserCredit
};