const { createTransaction, serviceInOut, serviceIn } = require("./transaction.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserControllerLogTitle } = require("../users/users.domain");
const { constants } = require("http2");
const { TransactionControllerLogTitle } = require("./transaction.domain");


const createTransactionController = async(req, res, next) => {
    try{
        const { takenBy, isMoved, linenId}= req.body;
        const result = await createTransaction({
            takenBy: takenBy,
            isMoved: isMoved,
            linenId: linenId,
        });
        return res.status(result.code).send(result)

    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .status(err.message)
    }
};

const serviceInOutController = async(req, res, next) => {
    try{
        const {linenId, givenBy, takenBy} = req.body;
        const result = await serviceInOut({
            linenId: linenId,
            takenBy: takenBy,
            givenBy: givenBy
        });
        return res.status(result.code).send(result)
    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .status(err.message)
    }
};

const serviceInController = async (req, res, next) => {
    try{
        const {takenBy, linenId} = req.body;
        const result = await serviceIn({
            takenBy: takenBy,
            linenId: linenId,
        });
        return res.status(result.code).send(result)

    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .status(err.message)
    }
}

module.exports = {
    createTransactionController,
    serviceInOutController,
    serviceInController
}