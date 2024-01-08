const { LinenControllerLogTitle } = require("./linen.domain");
const { createLinen } = require("./linen.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { constants } = require("http2");



const createLinenController = async (req, res, next) => {
    try{
        const {rfid, categoryId, name} = req.body;
        const result = await createLinen({
            rfid: rfid,
            categoryId: categoryId,
            name: name,
        });

        return res.status(result.code).send(result)
    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: LinenControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .status(err)
    }
};

module.exports = {
    createLinenController
}