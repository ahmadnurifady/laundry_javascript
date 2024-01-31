const { Reports } = require("./report.model")
const {v4} = require('uuid')
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const { ReportServiceLogTitle } = require("./report.domain");




const createReport = async({linenId = "", photo = "", note = ""}) =>{
    try{
        const create = await Reports.create({
            id: v4(),
            linenId: linenId,
            photo: photo,
            note: note
        });
        return responseApi({
            code: constants.HTTP_STATUS_CREATED,
            data: create,
            message: "created report"
        })

    } catch(e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: ReportServiceLogTitle.ERROR,
            logMessage: e.message,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
};

module.exports = {
    createReport
}