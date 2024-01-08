const { createTransaction } = require("./transaction.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");

const createTransactionController = async(req, res, next) => {
    try{
        const {givenBy, takenBy, isMoved, linenId}= req.body;
        const result = await createTransaction({
            givenBy: givenBy,
            takenBy: takenBy,
            isMoved: isMoved,
            linenId: linenId,
        });
        return res.status(result.code).send(result)

    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: UserControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .status(err.message)
    }
};

module.exports = {
    createTransactionController
}