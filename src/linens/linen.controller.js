const { LinenControllerLogTitle } = require("./linen.domain");
const { createLinen } = require("./linen.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { constants } = require("http2");
const { responseApi } = require("../utils/response");



const createLinenController = async (req, res, next) => {
    try{
        if(rfid == null){
            const result = responseApi({code: constants.HTTP_STATUS_BAD_REQUEST, message: 'RFID should not be null'});
            return res.status(result.code).send(result)
        }
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
          .send(err)
    }
};

module.exports = {
    createLinenController
}