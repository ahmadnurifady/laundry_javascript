const { Users } = require("../users/users.model");
const { responseApi } = require("../utils/response");
const { serviceInOut, bulkServiceInOut } = require("./transaction.service");
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
      const result = bulkServiceInOut({ linenId, takenBy, givenBy });
      transactionSocket.emit("inOutSuccess", result);
    }
  );
};

module.exports = {
  transactionSocketHandler,
};
