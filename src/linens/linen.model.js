const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Linens = connection.define("linens", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  rfid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  replacedBy: {
    type: DataTypes.UUID,
    references: {
      model: "linens",
      key:  'id',
    }
  }
});


module.exports = {
    Linens
}