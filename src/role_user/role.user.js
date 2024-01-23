const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const RoleUsers = connection.define("roleUsers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});


module.exports = {
    RoleUsers,
}