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
    allowNull: true,
    references: {
      model: "linens",
      key:  'id',
    }
  }

});


module.exports = {
    Linens
}