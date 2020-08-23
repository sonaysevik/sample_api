const user_registration = {
    user: {
        name: 'test',
        surname: 'test2',
        password: '1234',
        email: 'test@test.com'
    }
};

const email_validation = {
    user: {
        name: 'test',
        surname: 'test2',
        password: '1234',
        email: 'test.com'
    }
};

const auth_user = {
    user: {
        name: 'test',
        surname: 'test2',
        password: '1234',
        email: 'auth@test.com'
    }
};

const buy_test1 = {
    fromCurrencyId: 1,
    toCurrencyId: 3,
    fromCurrencyAmount: 500
}

module.exports = {
    user_registration,
    email_validation,
    auth_user,
    buy_test1
};