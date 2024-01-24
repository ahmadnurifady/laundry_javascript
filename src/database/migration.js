const { Category } = require("../category_linen/category.linen");
const { Linens } = require("../linens/linen.model");
const { createLinen } = require("../linens/linen.service");
const { Orders } = require("../order/order.model");
const { RoleUsers } = require("../role_user/role.user");
const { Transaction } = require("../transaction/transaction.model");
const { Users } = require("../users/users.model");
const { createUser } = require("../users/users.services");
const { connection } = require("./connection");

async function migration() {
  try {
    /**
     * Testing Data
     */
    await connection.authenticate();
    await RoleUsers.sync();
    await Users.sync();
    await Category.sync();
    await Linens.sync();
    await Orders.sync();
    await Transaction.sync();
    await RoleUsers.create({ role: "admin" });
    await createUser({
      password: "123456",
      roleUserId: 1,
      username: "ahmad",
      barcodeId: "0987654321",
    });
    await createUser({
      password: "123456",
      roleUserId: 1,
      username: "teguh",
      barcodeId: "1234567890",
    });
    await Category.create({
      name: "Selimut",
      weight: 2,
      unit: "KG",
      price: 20000,
    });
    await Category.create({
      name: "Baju",
      weight: 1,
      unit: "KG",
      price: 10000,
    });
    await createLinen({
      categoryId: 1,
      name: "Selimut Pasien",
      rfid: "E2806891000400DAF22792C",
    });
    await createLinen({
      categoryId: 1,
      name: "Baju Operasi Pasien",
      rfid: "E2806891000500DAF231529",
    });
  } catch (e) {
    console.log(e);
  }
}

migration();
