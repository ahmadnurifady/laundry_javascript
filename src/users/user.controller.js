const { constants } = require("http2");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserControllerLogTitle } = require("./users.domain");
const { login } = require("./users.services");

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await login({ username: username, password: password });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(err.message);
  }
};

module.exports = {
    loginController
}
