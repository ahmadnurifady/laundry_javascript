const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./src/index.route");
const { connection } = require("./src/database/connection");
const { LOGTYPE } = require("./src/logger/logger.domain");
const { logEvent } = require("./src/logger/logger");
const { RelationalMiddleware } = require("./src/middleware/relational.middleware");
const { transactionSocketHandler } = require("./src/transaction/transaction.socket.controller");
const server = require('http').createServer(app);
const io = require('socket.io')(server);


(async () => {
  const port = process.env.PORT || 5000;
  try {    
    app.use(express.static('./src'))
    app.use(express.json());
    app.use(cors());
    app.use(RelationalMiddleware);
    app.use(routes);

    
    /**
     * Socket Registrant
     */
    io.on('connection', transactionSocketHandler)


    await connection.authenticate();
  } catch (err) {
    logEvent(LOGTYPE.FATAL, {
      logTitle: "[APP-CRASHED]",
      logMessage: err.message,
    });
    process.exit(1);
  }
  server.listen(port, null, () => {
    console.log(`SERVER RUNNING ON ${port}`)
  });
})();
