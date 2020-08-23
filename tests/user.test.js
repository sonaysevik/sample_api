const { app } = require('../app');
const { sequelize } = require('../utils/config');
const statusCodes = require('http-status-codes');
const request = require('supertest');
const {
		user_registration,
		email_validation,
		auth_user,
		buy_test1
	} = require('./users.data');
const { truncate,
		authorizedAgent,
		saveUser
	} = require('./test_utils');
let server, agent;

beforeAll((done) => {
    server = app.listen(4000, async (err) => {
		if (err) return done(err);
		agent = request(server);
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

test('User API -> Test register API.', async (done) => {
	const req = agent
				.post('/users');
	const res = await req.send(user_registration)
				.set('Accept', 'application/json');
  expect(res.statusCode).toEqual(statusCodes.CREATED);
  expect(res.body).toHaveProperty('newUser');
  expect(res.body).toHaveProperty('userCredit');
  done();
});

test('User API -> Test email validation.', async (done) => {
	const res = await agent
					.post('/users')
					.send(email_validation)
					.set('Accept', 'application/json');
	expect(res.statusCode).toEqual(statusCodes.BAD_REQUEST);
	expect(res.body).toHaveProperty('error');
	done();
  });

test('User API -> Test get user credits.', async (done) => {
	let res = await	agent.post('/users')
					.send(user_registration)
					.set('Accept', 'application/json');
	res = await agent
				.get(`/users/${res.body.newUser.id}/credits`)
				.send();
	expect(res.statusCode).toEqual(statusCodes.OK);
	expect(res.body).toHaveProperty('userCredits');
	done();
});

test('User API -> Test buying credits.', async (done) => {
	const {body} = await agent
					.post('/users')
					.send(user_registration)
					.set('Accept', 'application/json');
	const buyRes = await agent
				.post(`/users/${body.newUser.id}/buy`)
				.send(buy_test1)
				.set('Accept', 'application/json');
	expect(buyRes.statusCode).toEqual(statusCodes.OK);
	const userCreditsRes = await agent
								.get(`/users/${body.newUser.id}/credits`)
								.send();
	expect(userCreditsRes.body).toHaveProperty('userCredits');
	expect(userCreditsRes.body.userCredits.length).toEqual(2);
	expect(userCreditsRes.body.userCredits[0].amount).toEqual(500);
	expect(userCreditsRes.body.userCredits[1].amount).toEqual(1.6833774700390483);
	done();
});

