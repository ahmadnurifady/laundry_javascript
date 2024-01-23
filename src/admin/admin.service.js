const { RoleUsers } = require("../role_user/role.user")
const { responseApi } = require("../utils/response");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserServiceLogTitle } = require("../users/users.domain");
const { constants } = require("http2");
const { AdminServiceLogTitle } = require("./admin.domain");


const createRole = async ({id = 0, role = ""}) => {
    try{
        const create = await RoleUsers.create({
            id: id,
            role: role
        });
        return responseApi({
            message:"SUCCESS CREATE ROLE USER",
            code: constants.HTTP_STATUS_CREATED,
            data: create
        })

    } catch (e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: AdminServiceLogTitle.ERROR,
            logMessage: e.ERROR,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
};

module.exports = {
    createRole
}