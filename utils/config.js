
const Sequelize = require('sequelize');
const logger = require('./logger');

const configs = {};

configs.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
configs.PORT = process.env.PORT ? process.env.PORT : 3000;
configs.DB_HOST =  process.env.DB_HOST ? process.env.DB_HOST : '192.168.99.100';
configs.DB_NAME =  process.env.DB_NAME ? process.env.DB_NAME : 'currency';
configs.DB_USERNAME =  process.env.DB_USERNAME ? process.env.DB_USERNAME : 'api_user';
configs.DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'kolay_vCRt65';

const sequelize = new Sequelize(configs.DB_NAME,
                                configs.DB_USERNAME,
                                configs.DB_PASSWORD,
                              { host: configs.DB_HOST,
                                dialect: "postgres", 
                                port:    5432,
                                logging: configs.NODE_ENV === 'test' ? false : true
                              });

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  },  (err) => { 
    logger.error('Unable to connect to the database:', err);
  });

configs.sequelize = sequelize;

module.exports = configs;



