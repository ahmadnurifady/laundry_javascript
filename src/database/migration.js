const { Category } = require('../category_linen/category.linen')
const { Linens } = require('../linens/linen.model')
const { RoleUsers } = require('../role_user/role.user')
const { Transaction } = require('../transaction/transaction.model')
const { Users } = require('../users/users.model')
const { createUser } = require('../users/users.services')
const {connection} = require('./connection')


async function migration () {
    await connection.authenticate()

    await RoleUsers.sync()
    await Users.sync()
    await Category.sync()
    await Linens.sync()
    await Transaction.sync()
   try{
    await createUser({password: '123456', roleUserId: 1, username: 'teguh', barcodeId: '123456789'});
   }catch(e){
    console.log(e);
   }
}

migration()