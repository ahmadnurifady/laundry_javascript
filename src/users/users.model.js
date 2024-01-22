const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Users = connection.define("users", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  roleUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'roleUsers',
      key: 'id'
    }
  },

  barcodeId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
});


module.exports = {
    Users
}