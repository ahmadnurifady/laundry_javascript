const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Category = connection.define("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = {
    Category
}