const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Transaction = connection.define("transaction", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  givenBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'users',
        key: 'id',
    }
  },

  takenBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'users',
        key: 'id',
    }
  },

  isMoved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  linenId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'linens',
      key: 'id',
    }
  }
});


module.exports = {
    Transaction
}