const { v4 } = require("uuid");
const { Category } = require("../category_linen/category.linen");
const { Linens } = require("../linens/linen.model");
const { createLinen } = require("../linens/linen.service");
const { OrderDetails } = require("../order/order.details.model");
const { Orders } = require("../order/order.model");
const { Reports } = require("../report/report.model");
const { RoleUsers } = require("../role_user/role.user");
const { Transaction } = require("../transaction/transaction.model");
const { Users } = require("../users/users.model");
const { createUser } = require("../users/users.services");
const { connection } = require("./connection");

async function migration() {
  try {
    await connection.authenticate();
    await RoleUsers.sync();
    await Users.sync();
    await Category.sync();
    await Linens.sync();
    await Orders.sync();
    await Reports.sync()
    await Transaction.sync();
    await RoleUsers.create({id: "ADMIN-001", role: "admin" });
    await RoleUsers.create({id: "USER-002", role: "user" });
 
    await OrderDetails.sync();
    await RoleUsers.create({ role: "admin" });
    /**
     * Testing Data
     */
    // await createUser({
    //   password: "123456",
    //   roleUserId: "ADMIN-001",
    //   username: "ahmad",
    //   name: "Ahmad Nur Faizi",
    //   barcodeId: "0987654321",
    // });
    // await createUser({
    //   password: "123456",
    //   roleUserId: "ADMIN-001",
    //   username: "Teguh Triprasetya",
    //   username: "teguh",
    //   barcodeId: "1234567890",
    // });

    const createUserTest = await Users.create(
      {
        id: v4(),
        password: "123456",
        roleUserId: 1,
        name: "Teguh Triprasetya",
        username: "teguh",
        barcodeId: "1234567890",
      },
      { returning: true }
    );
    await createUser({
      password: "123456",
      roleUserId: 1,
      username: "ahmad",
      name: "Ahmad Nur Faizi",
      barcodeId: "0987654321",
    });
    await createUser({
      password: "123456",
      roleUserId: 1,
      username: "dwi",
      name: "Dwi Haryadi",
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

    await Category.create({
      name: "Tirai",
      weight: 1,
      unit: "KG",
      price: 10000,
    });
    await createLinen({
      categoryId: 1,
      name: "Selimut Pasien",
      rfid: "E2806891000400DAF22792C",
      ownedBy: createUserTest.id,
    });
    await createLinen({
      categoryId: 1,
      name: "Baju Operasi Pasien",
      rfid: "E2806891000500DAF231529",
    });
    await createLinen({
      categoryId: 2,
      name: "Tirai Pasien",
      rfid: "E2806891000400DAF21792C",
    });
  } catch (e) {
    console.log(e);
  }
}

migration();
