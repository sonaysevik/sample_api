const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');

const Currencies = sequelize.define('currencies', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
        type: Sequelize.DOUBLE
    }
  },
  {
	timestamps: false
  });

module.exports = Currencies;
  