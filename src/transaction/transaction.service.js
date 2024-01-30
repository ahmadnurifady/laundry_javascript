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

const bulkServiceInOut = async ({
  linenId = [],
  takenBy = "",
  givenBy = "",
}) => {
  try {
    if (linenId.length === 0 || typeof linenId !== "object") {
    await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_BAD_REQUEST,
        message: "Linens should not be empty",
      });
    }
    let failedLinen = [];
    for (let i = 0; i < linenId.length; i++) {
      const result = await serviceInOut({
        linenId: linenId[i],
        takenBy,
        givenBy,
      });
      if (result.code !== constants.HTTP_STATUS_OK)
        failedLinen.push(linenId[i]);
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

const serviceInOut = async ({ linenId = "", givenBy = "", takenBy = "" }) => {
  const t = await connection.transaction();
  try {
    const findLinen = await Linens.findOne({ where: { rfid: linenId } });
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

    const findTX = await Transaction.findOne({
      where: {
        linenId: findLinen.id,
        isMoved: false,
        takenBy: findUserGivenBy.id,
      },
      include: [{ model: Orders, where: { isCompleted: false } }],
    });

    if (!findTX) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.NOT_FOUND,
      });
    }

    findTX.isMoved = true;
    await findTX.save({ transaction: t });

    const createTX = await Transaction.create(
      {
        id: v4(),
        linenId: findLinen.id,
        isMoved: false,
        takenBy: findUserTakenBy.id,
        givenBy: findUserGivenBy.id,
        orderId: findTX.orderId,
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

const completedTransaction = async ({ rfid = "" }) => {
  const t = await connection.transaction();
  try {
    const findLinen = await Linens.findOne({ where: { rfid: rfid } });
    if (!findLinen) {
      await t.rollback();
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      });
    }

    const findTransaction = await Transaction.findOne({
      where: { isMoved: false, linenId: findLinen.id },
    });
    if (!findTransaction) {
      await t.rollback();
      return responseApi({
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
        code: constants.HTTP_STATUS_BAD_REQUEST,
      });
    }

    await Orders.update(
      { isCompleted: true },
      {
        where: { id: findTransaction.orderId },
        fields: ["isCompleted"],
        transaction: t,
      }
    );

    findTransaction.isMoved = true;
    await findTransaction.save({ transaction: t });
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

const serviceIn = async ({
  givenBy = "",
  takenBy = "",
  linenId = "",
  orderId = null,
}) => {
  const t = await connection.transaction();
  try {
    const findGivenBy = await Users.findOne({ where: { barcodeId: givenBy } });
    const findTakenBy = await Users.findOne({ where: { barcodeId: takenBy } });
    if (!findTakenBy || !findGivenBy) {
      await t.rollback();
      return responseApi({
        message: "user is doesn't exist",
        code: constants.HTTP_STATUS_BAD_REQUEST,
      });
    }
    const findLinen = await Linens.findOne({ where: { rfid: linenId } });
    if (!findLinen) {
    await t.rollback();
      return responseApi({
        message: "linen is doesn't exist",
        code: constants.HTTP_STATUS_BAD_REQUEST,
      });
    }

    const findTxLinen = await Transaction.findOne({
      where: { linenId: findLinen.id },
      include: [{ model: Orders, where: { isCompleted: false } }],
    });

    if (findTxLinen) {
    await t.rollback();

      return responseApi({
        message: "Linen is still have transaction",
        code: constants.HTTP_STATUS_BAD_REQUEST,
      });

    }

    let order;
    if (!orderId) {
      order = await Orders.create(
        { id: v4(), orderBy: findGivenBy.id },
        { returning: true, transaction: t }
      );
      
    }

    const create = await Transaction.create(
      {
        id: v4(),
        givenBy: findGivenBy.id,
        orderId: orderId ?? order.id,
        takenBy: findTakenBy.id,
        isMoved: false,
        linenId: findLinen.id,
        message: `LINEN ${findLinen.rfid} TELAH MASUK KE ${findTakenBy.name} dari ${findGivenBy.name}`,
      },
      { transaction: t }
    );

    await t.commit();

    return responseApi({
      message: "SUCCESS SERVICE IN",
      data: create,
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
  serviceIn,
};
