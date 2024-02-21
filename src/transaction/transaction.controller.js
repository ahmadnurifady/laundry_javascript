const {
  serviceInOut,
  bulkServiceInOut,
  startTransaction,
  returnTransaction,
} = require("./transaction.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { constants } = require("http2");
const { TransactionControllerLogTitle } = require("./transaction.domain");
const { responseApi } = require("../utils/response");

const serviceInOutController = async (req, res, next) => {
  try {
    const { linenId, givenBy, takenBy } = req.body;
    const result = await bulkServiceInOut({ givenBy, takenBy, linenId });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(err.message);
  }
};

const returnTransactionController = async (req, res) => {
  try {
    const { rfids, takenBy, givenBy, orderId, isOwned } = req.body;
    const result = await returnTransaction({
      rfids,
      takenBy,
      givenBy,
      orderId,
      isOwned
    });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(err.message);
  }
};

const startTransactionController = async (req, res, next) => {
  try {
    const { takenBy, rfids, givenBy, isOwned } = req.body;
    const result = await startTransaction({
      rfids: rfids,
      takenBy,
      givenBy,
      isOwned
    });
    return res.status(result?.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });

    const resultError = responseApi({
      message: err.message,
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });
    return res.status(resultError.code).send(resultError);
  }
};

module.exports = {
  serviceInOutController,
  returnTransactionController,
  startTransactionController,
};
