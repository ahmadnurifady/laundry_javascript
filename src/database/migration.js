const { Category } = require('../category_linen/category.linen')
const { Linens } = require('../linens/linen.model')
const { RoleUsers } = require('../role_user/role.user')
const { Transaction } = require('../transaction/transaction.model')
const { Users } = require('../users/users.model')
const {connection} = require('./connection')


async function migration () {
    await connection.authenticate()

    await RoleUsers.sync()
    await Users.sync()
    await Category.sync()
    await Linens.sync()
    await Transaction.sync()

}

migration()