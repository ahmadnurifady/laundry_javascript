const { Users } = require("../users/users.model");
const { responseApi } = require("../utils/response");
const {  bulkServiceInOut, bulkServiceIn } = require("./transaction.service");
const jwt = require("jsonwebtoken");
const { constants } = require("http2");

const transactionSocketHandler = (transactionSocket) => {
  console.log("Mantap Transaction");
  transactionSocket.use(async (socket, next) => {
    /**
     * Authorization
     */
    const { token } = socket.handshake.auth;
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await Users.findByPk(id);
    if (!findUser) {
      socket.emit(
        "errorAuth",
        responseApi({
          code: constants.HTTP_STATUS_FORBIDDEN,
          message: "Unauthorized",
        })
      );
      return;
    }

    next();
  });

  transactionSocket.on(
    "inout",
    async ({ takenBy = "", givenBy = "", linenId = [] }) => {
      const result = await bulkServiceInOut({ linenId, takenBy, givenBy });
      transactionSocket.emit("inOutSuccess", result);
    }
  );

  transactionSocket.on(
    "in",
    async ({ takenBy = "", linenId = [] }) => {
      const result = await bulkServiceIn({ linensId: linenId, takenBy });
      transactionSocket.emit("inSuccess", result);
    }
  );
};

module.exports = {
  transactionSocketHandler,
};
