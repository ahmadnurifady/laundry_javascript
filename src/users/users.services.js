const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserServiceLogTitle, UserServiceErrorMessage } = require("./users.domain");
const { Users } = require("./users.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const bcrypt = require("bcrypt");

const login = async ({ username = "", password = "" }) => {
  try {
    const findUser = await Users.findOne({ where: { username: username } });
    if (!findUser) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }
    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      finduser.password
    );

    if (!isPasswordCorrect) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }
    return responseApi({ code: constants.HTTP_STATUS_OK, data: findUser });

  } catch (e) {
    
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};


module.exports = {
    login
}