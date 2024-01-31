const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Reports = connection.define("reports", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  linenId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  note: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
  
});


module.exports = {
    Reports
}