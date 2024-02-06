const { v4 } = require("uuid");
const { Transaction } = require("./transaction.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const {
  TransactionServiceLogTitle,
  TransactionServiceErrorMessage,
} = require("./transaction.domain");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { Linens } = require("../linens/linen.model");
const { connection } = require("../database/connection");
const { Users } = require("../users/users.model");
const { Orders } = require("../order/order.model");
const { OrderDetails } = require("../order/order.details.model");
const sequelize = require("sequelize");
const bulkServiceInOut = async ({ rfids = [], takenBy = "", givenBy = "" }) => {
  try {
    if (rfids.length === 0 || typeof rfids !== "object") {
      return responseApi({
        code: constants.HTTP_STATUS_BAD_REQUEST,
        message: "Linens should not be empty",
      });
    }

    let failedLinen = [];
    for (let i = 0; i < rfids.length; i++) {
      const result = await serviceInOut({
        rfids: rfids[i],
        takenBy,
        givenBy,
      });
      if (result.code !== constants.HTTP_STATUS_OK)
        failedLinen.push({ rfid: rfids[i], reasonFailed: result.message });
    }

    return responseApi({
      data: { failedLinen },
      code: constants.HTTP_STATUS_OK,
      message: "Success create transactions",
    });
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const serviceInOut = async ({ rfids = "", givenBy = "", takenBy = "" }) => {
  const t = await connection.transaction();
  try {
    const findLinen = await Linens.findOne({ where: { rfid: rfids } });
    if (!findLinen) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      });
    }

    const findUserTakenBy = await Users.findOne({
      where: { barcodeId: takenBy },
    });
    const findUserGivenBy = await Users.findOne({
      where: { barcodeId: givenBy },
    });
    if (!findUserTakenBy || !findUserGivenBy) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: "User Data is not found",
      });
    }

    const createTX = await Transaction.create(
      {
        id: v4(),
        linenId: findLinen.id,
        takenBy: findUserTakenBy.id,
        givenBy: findUserGivenBy.id,
        message: `LINEN ${findLinen.rfid} TELAH BERADA DI ${findUserTakenBy.name}`,
      },
      { transaction: t }
    );

    await t.commit();

    return responseApi({
      message: "Success Transaction IN OUT",
      data: createTX,
      code: constants.HTTP_STATUS_OK,
    });
  } catch (e) {
    await t.rollback();
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const completedTransaction = async ({ rfids = [], orderBy = "" }) => {
  const t = await connection.transaction();
  try {
    const findAllLinen = await Linens.findAll({
      where: {
        rfid: [...rfids],
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("category.id")), "categoryCount"],
        [sequelize.col("category.id"), "categoryId"],
      ],
      include: ["category"],
      group: ["category.id"],
      raw: true,
    });
    if (findAllLinen.length < 1) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      });
    }

    const findOrder = await Orders.findAll({
      where: { orderBy: orderBy },
      include: ["orderDetails"],
    });

    if (findOrder) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.ORDER_NOT_FOUND,
      });
    }
    let categories = {};
    findAllLinen.map((linen) => {
      if (!categories[linen.categoryId])
        categories[linen.categoryId] = linen.categoryCount;

      const selectedOrderDetails = findOrder.orderDetails.find(
        (orderDetail) => orderDetail.categoryId === linen.categoryId
      );

      if (selectedOrderDetails) {
      }
    });

    await await t.commit();
    return responseApi({
      message: "Success Completed Transaction",
      code: constants.HTTP_STATUS_OK,
    });
  } catch (e) {
    await t.rollback();
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const bulkServiceIn = async ({ takenBy = "", linensId = [], givenBy = "" }) => {
  try {
    if (linensId.length === 0 || typeof linensId !== "object") {
      return responseApi({
        code: constants.HTTP_STATUS_BAD_REQUEST,
        message: "Linens should not be empty",
      });
    }
    let failedTransactions = [];
    for (let i = 0; i < linensId.length; i++) {
      const result = await serviceIn({
        takenBy,
        linenId: linensId[i],
        givenBy,
      });
      if (result.code !== constants.HTTP_STATUS_OK)
        failedTransactions.push(linensId[i]);
    }

    return responseApi({
      data: { failedTransactions },
      code: constants.HTTP_STATUS_OK,
      message: "Success create transactions",
    });
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const startTransaction = async ({ givenBy = "", takenBy = "", rfids = [] }) => {
  const t = await connection.transaction();
  try {
    const findGivenBy = await Users.findOne({ where: { barcodeId: givenBy } });
    const findTakenBy = await Users.findOne({ where: { barcodeId: takenBy } });
    if (!findTakenBy || !findGivenBy) {
      await t.rollback();
      return responseApi({
        message: TransactionServiceErrorMessage.USER_NOT_FOUND,
        code: constants.HTTP_STATUS_BAD_REQUEST,
      });
    }
    const findAllLinen = await Linens.findAll({
      where: {
        rfid: [...rfids],
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("category.id")), "categoryCount"],
        [sequelize.col("category.id"), "categoryId"],
      ],
      include: ["category"],
      group: ["category.id"],
      raw: true,
    });

    const order = await Orders.create(
      { id: v4(), orderBy: findGivenBy.id },
      { returning: true, transaction: t }
    );

    const createOrderDetails = findAllLinen.map((linen) => {
      return OrderDetails.create(
        {
          orderId: order.id,
          id: v4(),
          categoryId: linen.categoryId,
          amount: parseInt(linen.categoryCount ?? 0),
        },
        { transaction: t }
      );
    });

    const createOrder = (await Promise.allSettled(createOrderDetails)).filter(
      (resultOrder) => resultOrder.status === "rejected"
    );

    if (createOrder.length > 0) throw new Error("ERROR-CREATE-ORDER-DETAILS");

    const createTranscation = await bulkServiceInOut({
      rfids: rfids,
      givenBy: givenBy,
      takenBy: takenBy,
    });

    console.log(createTranscation);

    if (createTranscation.code === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      throw new Error(createTranscation.message);

    await t.commit();

    return responseApi({
      message: "SUCCESS SERVICE IN",
      data: null,
      code: constants.HTTP_STATUS_OK,
    });
  } catch (e) {
    await t.rollback();
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

module.exports = {
  serviceInOut,
  bulkServiceInOut,
  bulkServiceIn,
  completedTransaction,
  startTransaction,
};
