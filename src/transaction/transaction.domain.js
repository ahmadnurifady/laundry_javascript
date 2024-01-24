const { LOGTYPE } = require("../logger/logger.domain");
const {
  logTitleGenerator,
  SPOT_LOG_TYPE,
  MODULE_LOG_TYPE,
} = require("../utils/logTitleGenerator");

const TransactionServiceLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.SERVICES,
    MODULE_LOG_TYPE.TRANSACTION
  ),
};

const TransactionControllerLogTitle = {
  ERROR: logTitleGenerator(
    LOGTYPE.ERROR,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  WARN: logTitleGenerator(
    LOGTYPE.WARN,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  FATAL: logTitleGenerator(
    LOGTYPE.FATAL,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.TRANSACTION
  ),
  INFO: logTitleGenerator(
    LOGTYPE.INFO,
    SPOT_LOG_TYPE.CONTROLLER,
    MODULE_LOG_TYPE.TRANSACTION
  ),
};

const TransactionServiceErrorMessage = {
  WRONG_CREDENTIALS: "Username atau password salah",
  GENERAL_ERROR: "INTERNAL SERVER ERROR",
  NOT_FOUND: "Data linen tersebut belum masuk di dalam transaksi. Silakan untuk melakukan In Transaksi terlebih dahulu",
  LINEN_NOT_FOUND: "Data Linen tidak ditemukan."
};

module.exports = {
  TransactionServiceLogTitle,
  TransactionServiceErrorMessage,
  TransactionControllerLogTitle,
};
