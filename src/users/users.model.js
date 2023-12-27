const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Users = connection.define("users", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = {
    Users
}