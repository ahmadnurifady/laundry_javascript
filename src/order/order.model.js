const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Orders = connection.define("orders", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  orderBy: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key:  'id',
    }
  },

  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
  
  
}, {
    paranoid: true
});


module.exports = {
    Orders
}