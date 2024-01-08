const { v4 } = require("uuid")
const { Transaction } = require("./transaction.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const { TransactionServiceLogTitle } = require("./transaction.domain");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");



const createTransaction = async({givenBy = "", takenBy = "", isMoved = false, linenId = ""}) => {
    try {
        const create = await Transaction.create({
            id:  v4,
            givenBy: givenBy,
            takenBy:takenBy,
            isMoved:isMoved,
            linenId: linenId,
        });
        return responseApi({
            message: "Success Create Transaction",
            data: create,
            code: constants.HTTP_STATUS_CREATED
        });

    }catch (e){
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

module.exports =  {
    createTransaction
}