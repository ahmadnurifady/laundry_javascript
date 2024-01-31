const { createReport } = require("./report.service");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { constants } = require("http2");
const { ReportControllerLogTitle } = require("./report.domain");
const { upload } = require("../middleware/multer.middleware");


const createReportController =  async (req, res, next) =>{
    try{

        const {linenId, note} = req.body;
        const photo = req.file;

        console.log(typeof photo)
        console.log(photo)
    
        const result = await createReport({
            linenId: linenId,
            photo: photo.filename || "",
            note: note
        });
        return res.status(result.code).send(result)
    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: ReportControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
            .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .status(err.message);
    }


};

module.exports = {
    createReportController
}