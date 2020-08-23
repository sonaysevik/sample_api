const { app } = require('../app');
const request = require('supertest');
const { sequelize } = require('../utils/config');
const statusCodes = require('http-status-codes');
const UserCredits = require('../models/user_credits');
const {
		auth_user
	} = require('./users.data');
const { truncate,
        getToken,
        authorizedAgent,
        saveUser
    } = require('./test_utils');
const test_utils = require('./test_utils');
const { validateToken
        } = require('../controllers/login/login.controllers');
let server, agent;

beforeAll((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);
       agent = request.agent(server);
       done();
    });
});

beforeEach(async (done) => {
    await truncate();
    const token = await saveUser(agent, auth_user);
	agent = authorizedAgent(agent, token);
	done();
})

afterAll((done) => {
  sequelize.close();
  return server && server.close(done);
});

test('Currencies API -> Test List currencies', async (done) => {
	const currencyRes = await agent
							.get('/currencies')
							.send();
    expect(currencyRes.statusCode).toEqual(statusCodes.OK);
    expect(currencyRes.body.currencies.length).toEqual(4);
	done();
});
