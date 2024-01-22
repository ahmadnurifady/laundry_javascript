const { createRole } = require("./admin.service");
const { logEvent } = require("../logger/logger");
const { constants } = require("http2");
const { LOGTYPE } = require("../logger/logger.domain");
const { AdminControllerLogTitle } = require("./admin.domain");


const createRoleController = async (req, res, next) => {
    try {
        const {id, role} = req.body;
        const result = await createRole({
            id: id,
            role: role
        });
        return res.status(result.code).send(result)
    } catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: AdminControllerLogTitle.ERROR,
            logMessage: err.message,
          });
          return res
            .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .status(err.message)
    }
};

module.exports = {
    createRoleController
}