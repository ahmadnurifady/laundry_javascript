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

const createTransaction = async ({
  takenBy = "",
  isMoved = false,
  linenId = "",
}) => {
  try {
    const create = await Transaction.create({
      id: v4(),
      takenBy: takenBy,
      isMoved: isMoved,
      linenId: linenId,
    });
    return responseApi({
      message: "Success Create Transaction",
      data: create,
      code: constants.HTTP_STATUS_CREATED,
    });
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const bulkServiceInOut = async ({
  linenId = [],
  takenBy = "",
  givenBy = "",
}) => {
  try {
    if (linenId.length === 0 || typeof linenId !== "object") {
      return responseApi({
        code: constants.HTTP_STATUS_BAD_REQUEST,
        message: "Linens should not be empty",
      });
    }
    let failedLinen = [];
    linenId.map(async (linen) => {
      const result = await serviceInOut({ linenId: linen, takenBy, givenBy });
      if(result.code !== constants.HTTP_STATUS_OK){
        failedLinen.push(linen);
      }
    });

    return responseApi({
        data: {failedLinen},
        code: constants.HTTP_STATUS_OK,
        message: "Success create transactions"
    })
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
    const findLinen = await Linens.findOne({where: {rfid: linenId}});
    if(!findLinen){
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      });
    }

    const findTX = await Transaction.findOne({
      where: {
        linenId: findLinen.id,
        isMoved: false,
        takenBy: givenBy,
      },
    });
    if (!findTX) {
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
        takenBy: takenBy,
        givenBy: givenBy,
        tracking
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

const completedTransaction = async ({rfid = ''}) => {
  const t = await connection.transaction();
  try{
    const findLinen = await Linens.findOne({where: {rfid: rfid}});
    if(!findLinen) {
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      }); 
    }
    

     await Transaction.update({isCompleted: true}, {
      where: {linenId: findLinen.id},
      fields: ['isCompleted'],
      transaction: t
    });
    
    await t.commit();
    return responseApi({
      message: "Success Completed Transaction",
      code: constants.HTTP_STATUS_OK,
    });
  }catch(e){
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
}

module.exports = {
  createTransaction,
  serviceInOut,
  bulkServiceInOut,
  completedTransaction
};
