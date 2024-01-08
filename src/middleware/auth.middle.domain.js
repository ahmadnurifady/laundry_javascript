const { LOGTYPE } = require("../logger/logger.domain");
const {
  logTitleGenerator,
  SPOT_LOG_TYPE,
  MODULE_LOG_TYPE,
} = require("../utils/logTitleGenerator");

const AuthMiddlewareLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.MIDDLEWARE,
    MODULE_LOG_TYPE.AUTHMIDDLEWARE
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.MIDDLEWARE,
    MODULE_LOG_TYPE.AUTHMIDDLEWARE
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.MIDDLEWARE,
    MODULE_LOG_TYPE.AUTHMIDDLEWARE
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.MIDDLEWARE,
    MODULE_LOG_TYPE.AUTHMIDDLEWARE
  ),
};


module.exports = {
  AuthMiddlewareLogTitle,
};
