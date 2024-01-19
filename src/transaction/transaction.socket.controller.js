const { serviceInOut } = require("./transaction.service");

const transactionSocketHandler = (transactionSocket) => {
  transactionSocket.use((socket, next) => {
    /**
     * Authorization
     */
  });

  transactionSocket.on("inout", async (data) => {
    const { takenBy, givenBy, linenId } = data;
    const result = await serviceInOut({
      givenBy: givenBy,
      takenBy: takenBy,
      linenId: linenId,
    });
    
  });
};
