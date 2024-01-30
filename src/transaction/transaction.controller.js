const {
  serviceInOut,
  bulkServiceInOut,
  completedTransaction,
  serviceIn,
  bulkServiceIn,
} = require("./transaction.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { constants } = require("http2");
const { TransactionControllerLogTitle } = require("./transaction.domain");

const serviceInOutController = async (req, res, next) => {
  try {
    const { isBulk } = req.query;
    const { linenId, givenBy, takenBy } = req.body;
    if (isBulk) {
      const result = await bulkServiceInOut({ givenBy, takenBy, linenId });
      return res.status(result.code).send(result);
    }
    const result = await serviceInOut({
      linenId: linenId,
      takenBy: takenBy,
      givenBy: givenBy,
    });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .status(err.message);
  }
};

const completeTransactioController = async (req, res) => {
  try {
    const { rfid } = req.body;
    const result = await completedTransaction({ rfid });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .status(err.message);
  }
};

const serviceInController = async (req, res, next) => {
  try {
    const { takenBy, linenId, givenBy } = req.body;
    const {isBulk} = req.query;
    if(isBulk) {
      const result = await bulkServiceIn({linensId: linenId, takenBy, givenBy})
      return res.status(result.code).send(result);
    }
    
    const result = await serviceIn({
      takenBy: takenBy,
      linenId: linenId,
    });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .status(err.message);
  }
};

module.exports = {
  serviceInOutController,
  completeTransactioController,
  serviceInController,
};
