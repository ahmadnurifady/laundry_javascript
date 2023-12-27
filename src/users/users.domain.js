const { LOGTYPE } = require("../logger/logger.domain");
const {
  logTitleGenerator,
  SPOT_LOG_TYPE,
  MODULE_LOG_TYPE,
} = require("../utils/logTitleGenerator");

const UserServiceLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.USERS
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.USERS
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.USERS
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.USERS
  ),
};

const UserControllerLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.USERS
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.USERS
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.USERS
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.USERS
  ),
};

const UserServiceErrorMessage = {
  WRONG_CREDENTIALS: "USERNAME OR PASSWORD IS WRONG",
  GENERAL_ERROR: "INTERNAL SERVER ERROR",
  NOT_FOUND: "DATA IS NOT FOUND",
};

module.exports = {
  UserServiceLogTitle,
  UserServiceErrorMessage,
  UserControllerLogTitle,
};
