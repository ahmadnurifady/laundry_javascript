const { LOGTYPE } = require("../logger/logger.domain");
const {
  logTitleGenerator,
  SPOT_LOG_TYPE,
  MODULE_LOG_TYPE,
} = require("../utils/logTitleGenerator");

const LinenServiceLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.LINENS
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.LINENS
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.LINENS
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.LINENS
  ),
};

const LinenControllerLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.LINENS
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.LINENS
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.LINENS
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.LINENS
  ),
};



module.exports = {
  LinenServiceLogTitle,
  LinenControllerLogTitle
};
