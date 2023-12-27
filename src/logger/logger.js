const bunyan = require("bunyan");
const { LOGTYPE } = require("./logger.domain");
const logger = bunyan.createLogger({
  name: process.env.APP_NAME || "Backend Laundry",
  level: "info",
  streams: [
    {
      stream: process.stdout,
    },
    {
      type: "rotating-file",
      period: "1d",
      count: 7,
      level: "error",
      path: process.env.LOG_PATH || "./src/logger/logResult/log-error.json",
    },
  ],
});

const logEvent = (logType, { logTitle = "", logMessage = "" }) => {
  switch (logType) {
    case LOGTYPE.ERROR:
      logger.error(logTitle, logMessage);
      break;

    case LOGTYPE.FATAL:
      logger.fatal(logTitle, logMessage);
      break;

    case LOGTYPE.INFO:
      logger.info(logTitle, logMessage);
      break;

    case LOGTYPE.WARN:
      logger.warn(logTitle, logMessage);
      break;
  }
};

module.exports = {
  logEvent
};
