const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const OrderDetails = connection.define(
  "orderDetails",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = {
  OrderDetails
};
