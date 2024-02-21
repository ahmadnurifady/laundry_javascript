const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Transaction = connection.define(
  "transaction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    givenBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    takenBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    linenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "linens",
        key: "id",
      },
    },

    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
  
);

module.exports = {
  Transaction,
};
