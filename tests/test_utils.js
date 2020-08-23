
let models  = require('../models');
delete models.Currencies;
const request = require('supertest');
const {
    user_registration
} = require('./users.data');

const truncate = async () => {
    await Promise.all(
        Object.keys(models).map((key) => {
            return models[key].destroy({ where: {}, force: true });
        })
    );
};

const getToken = async (agent, email, password) => {
    const res = await agent
                        .post('/login')
                        .set('Accept', 'application/json')
                        .send({
                            email,
                            password
                        });
    return res.body.token.token;
};

const saveUser = async (agent, user) => {
    await agent.post('/users')
                        .send(user)
                        .set('Accept', 'application/json');
    const token = await getToken(agent,
                            user.user.email,
                            user.user.password);
    return token
};

const hook = (agent, token, method = 'post') => (args) =>
                agent[method](args).set('Authorization', `Bearer ${token}`);

const authorizedAgent = (agent, token) => {
    const authRequest = {
        post: hook(agent, token, 'post'),
        get: hook(agent, token, 'get'),
        put: hook(agent, token, 'put'),
        delete: hook(agent, token, 'delete')
    };
    return authRequest;
};

module.exports = {
    truncate,
    getToken,
    authorizedAgent,
    saveUser
  };