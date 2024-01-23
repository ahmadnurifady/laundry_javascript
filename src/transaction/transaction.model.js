const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Transaction = connection.define("transaction", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },

  trackingNumber: {
    type: DataTypes.UUID,
    allowNull: false
  },

  givenBy: {
    type: DataTypes.UUID,
    allowNull: true,
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

  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  linenId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'linens',
      key: 'id',
    }
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
});


module.exports = {
    Transaction
}