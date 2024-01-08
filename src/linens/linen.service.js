const { v4 } = require("uuid")
const { Linens } = require("./linen.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const { LinenServiceLogTitle } = require("./linen.domain");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");



const createLinen  = async({rfid = "", categoryId = 0, name = ""}) => {
    try{
        const create = await Linens.create({
            id: v4(),
            rfid: rfid,
            categoryId: categoryId,
            name: name,
        });

        console.log(create)

        return responseApi({
            message: "Success Create Linen",
            data: create,
            code: constants.HTTP_STATUS_CREATED,
        })
        
    } catch (e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: LinenServiceLogTitle.ERROR,
            logMessage: e.message,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
};

module.exports = {
    createLinen
}