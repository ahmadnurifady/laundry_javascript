const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const routes = require("./src/index.route");
const result = dotenv.configDotenv();
const { connection } = require("./src/database/connection");
const { LOGTYPE } = require("./src/logger/logger.domain");
const { logEvent } = require("./src/logger/logger");
const { RelationalMiddleware } = require("./src/middleware/relational.middleware");

(async () => {
  if(result.error){
    console.log(result.error);
  }
  const port = process.env.PORT || 3000;

  try {
    console.log('mantap');
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
