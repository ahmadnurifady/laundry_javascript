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
  GENERAL_ERROR:
    "Saat ini sedang ada masalah dari server, silakan hubungi pihak terkait untuk menyelesaikan masalah ini.",
  NOT_FOUND:
    "Data Pemberi bukan pemegang terakhir linen. Silakan masukkan data pemegang terakhir untuk melakukan perpindahan",
  LINEN_NOT_FOUND: "Data Linen tidak ditemukan.",
  USER_NOT_FOUND:
    "Data Client atau Pengguna yang dimasukkan tidak ditemukan, silakan periksa kembali data yang dimasukkan.",
  ORDER_NOT_FOUND:
    "Data Order yang dimasukkan tidak ditemukkan. Silakan cek kembali data yagndimasukkan",
};

module.exports = {
  TransactionServiceLogTitle,
  TransactionServiceErrorMessage,
  TransactionControllerLogTitle,
};
