const { Category } = require("../category_linen/category.linen");
const { Linens } = require("../linens/linen.model");
const { OrderDetails } = require("../order/order.details.model");
const { Orders } = require("../order/order.model");
const { RoleUsers } = require("../role_user/role.user");
const { Transaction } = require("../transaction/transaction.model");
const { Users } = require("../users/users.model");

async function RelationalMiddleware(req, res, next) {
  Users.belongsTo(RoleUsers);
  RoleUsers.hasMany(Users);

  Linens.belongsTo(Linens, { foreignKey: "id" });

  Linens.belongsTo(Category);
  Category.hasMany(Linens);

  Users.belongsTo(Transaction, { foreignKey: "id" });

  Transaction.belongsTo(Linens);
  Linens.hasMany(Transaction);

  Orders.hasMany(OrderDetails);
  OrderDetails.belongsTo(Orders);

  Category.hasMany(OrderDetails);
  OrderDetails.belongsTo(Category);

  next();
}

module.exports = {
  RelationalMiddleware,
};
