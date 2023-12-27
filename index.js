const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const routes = require("./src/index.route");
const { connection } = require("./src/database/connection");
const { LOGTYPE } = require("./src/logger/logger.domain");
const { logEvent } = require("./src/logger/logger");

(async () => {
  dotenv.config();
  const port = process.env.PORT || 3000;

  try {
    app.use(express.json());
    app.use(cors());
    app.use(routes);
    logEvent(LOGTYPE.ERROR, {
      logTitle: 'mANTAP',
      logMessage: 'MANTAP'
    })
    await connection.authenticate();
  } catch (err) {
    logEvent(LOGTYPE.FATAL, {
      logTitle: "[APP-CRASHED]",
      logMessage: err.message,
    });
    process.exit(1);
  }

  app.listen(port, () => {
    console.log("SERVER RUN ON PORT", port);
  });
})();
