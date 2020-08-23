const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');
const Users = require('./users');
const Currencies = require('./currencies');

const Tokens = sequelize.define('tokens', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expires_at: {
      type: Sequelize.NUMBER,
      allowNull: false
    }
  },
  {
    timestamps: false
  });
  
Users.hasMany(Tokens, { foreignKey: 'user_id' });
Tokens.belongsTo(Users, {foreignKey: 'user_id'} );

module.exports = Tokens;
  