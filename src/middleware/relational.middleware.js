const { CategoryLinen, Category } = require("../category_linen/category.linen");
const { Linens } = require("../linens/linen.model");
const { RoleUsers } = require("../role_user/role.user");
const { Transaction } = require("../transaction/transaction.model");
const { Users } = require("../users/users.model");
const { constants } = require('http2');
const { responseApi } = require("../utils/response");


async function RelationalMiddleware(req, res, next) {
        Users.belongsTo(RoleUsers)
        RoleUsers.hasMany(Users)

        Linens.hasMany(Linens)


        Linens.belongsTo(Category)
        Category.hasMany(Linens)
    


        Linens.belongsTo(Transaction)
        Transaction.hasMany(Linens)
        next()
 

}

module.exports = {
    RelationalMiddleware
}