const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./src/index.route");
const { connection } = require("./src/database/connection");
const { LOGTYPE } = require("./src/logger/logger.domain");
const { logEvent } = require("./src/logger/logger");
const { RelationalMiddleware } = require("./src/middleware/relational.middleware");

(async () => {
  const port = process.env.PORT || 5000;

  try {
    app.use(express.json());
    app.use(cors());
    app.use(RelationalMiddleware);
    app.use(routes);

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
