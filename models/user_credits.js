const { sequelize } = require('../utils/config');
const Sequelize = require('sequelize');
const Users = require('./users');
const Currencies = require('./currencies');

const UserCredits = sequelize.define('usercredits', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id',
      autoIncrement: true
    },
    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull:false
    }
  },
  {
    timestamps: false
  });
  
Users.hasMany(UserCredits, { foreignKey: 'user_id' });
UserCredits.belongsTo(Users, {foreignKey: 'user_id'} );
Currencies.hasMany(UserCredits, { foreignKey: 'currency_id' });
UserCredits.belongsTo(Currencies, {foreignKey: 'currency_id'} );

module.exports = UserCredits;
  