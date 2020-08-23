const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./controllers/user/user.routes');
const loginRoutes = require('./controllers/login/login.routes');
const currenyRoutes = require('./controllers/currency/currency.routes');
const { errorHandler } = require('./utils/utils');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(userRoutes);
app.use(loginRoutes);
app.use(currenyRoutes);
app.use(errorHandler);


module.exports = {
  app
};