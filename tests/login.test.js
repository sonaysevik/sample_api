const { app } = require('../app');
const request = require('supertest');
const { sequelize } = require('../utils/config');
const statusCodes = require('http-status-codes');
const UserCredits = require('../models/user_credits');
const {
		user_registration
	} = require('./users.data');
const { truncate,
		getToken
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
	done();
})

afterAll((done) => {
  sequelize.close();
  return server && server.close(done);
});

test('Login API -> Test login', async (done) => {
	const { body } = await agent
							.post('/users')
							.send(user_registration)
							.set('Accept', 'application/json');
	const loginRes = await agent.post('/login')
								.send({
									email: user_registration.user.email,
									password: user_registration.user.password
								})
								.set('Accept', 'applicatin/json');
	expect(loginRes.body).toHaveProperty('token');
	expect(loginRes.body.token).toHaveProperty('token');
	expect(loginRes.statusCode).toEqual(statusCodes.OK);
	done();
});

test('LoginAPI -> Login token validation shoudl return unauthorized', async (done) => {
	const currencyRes = await agent
							.get('/currencies')
							.send();
	expect(currencyRes.statusCode).toEqual(statusCodes.UNAUTHORIZED);
	done();
})