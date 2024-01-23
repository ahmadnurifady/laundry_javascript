const { v4 } = require("uuid");
const { Transaction } = require("./transaction.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const {
  TransactionServiceLogTitle,
  TransactionServiceErrorMessage,
} = require("./transaction.domain");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { Users } = require("../users/users.model");
const { Linens } = require("../linens/linen.model");
const { connection } = require("../database/connection");


const bulkServiceInOut = async ({
  linenId = [],
  takenBy = "",
  givenBy = "",
}) => {
  try {
    if (linenId.length === 0 || typeof linenId !== "object") {
      return responseApi({
        code: constants.HTTP_STATUS_BAD_REQUEST,
        message: "Linens should not be empty",
      });
    }
    let failedLinen = [];
    linenId.map(async (linen) => {
      const result = await serviceInOut({ linenId: linen, takenBy, givenBy });
      if(result.code !== constants.HTTP_STATUS_OK){
        failedLinen.push(linen);
      }
    });

    return responseApi({
        data: {failedLinen},
        code: constants.HTTP_STATUS_OK,
        message: "Success create transactions"
    })
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const serviceInOut = async ({ linenId = "", givenBy = "", takenBy = "" }) => {
  const t = await connection.transaction();
  try {
    const findLinen = await Linens.findOne({where: {rfid: linenId}});
    if(!findLinen){
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.LINEN_NOT_FOUND,
      });
    }

    const findTX = await Transaction.findOne({
      where: {
        linenId: findLinen.id,
        isMoved: false,
        takenBy: givenBy,
      },
    });
    if (!findTX) {
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: TransactionServiceErrorMessage.NOT_FOUND,
      });
    }

    findTX.isMoved = true;
    await findTX.save({ transaction: t });

    const findUser = await Users.findByPk(takenBy)
    const findLinen = await Linens.findByPk(linenId)

    const createTX = await Transaction.create(
      {
        id: v4(),
        linenId: findLinen.id,
        isMoved: false,
        takenBy: takenBy,
        givenBy: givenBy,
        message: `LINEN ${findLinen.rfid} TELAH BERADA DI ${findUser.name}`
      },
      { transaction: t }
    );

    await t.commit();

    return responseApi({
      message: "Success Transaction IN OUT",
      data: createTX,
      code: constants.HTTP_STATUS_OK,
    });
  } catch (e) {
    await t.rollback();
    logEvent(LOGTYPE.ERROR, {
      logTitle: TransactionServiceLogTitle.ERROR,
      logMessage: e,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const serviceIn = async ({
    takenBy = "",
    linenId = "",
}) =>{
    try{
        const findUser = await Users.findByPk(takenBy)
        if(!findUser){
            return responseApi({
                message: "user is doesn't exist",
                code: constants.HTTP_STATUS_BAD_REQUEST
            });
        };
        const findLinen = await Linens.findByPk(linenId)
        if(!findLinen){
            return responseApi({
                message: "linen is doesn't exist",
                code: constants.HTTP_STATUS_BAD_REQUEST
            });
        };

        const findLinenTX = await Transaction.findOne({where:{
            linenId: linenId,
            isCompleted: false
        }});
        if(!findLinenTX){
            return responseApi({
                message: "findLinenTX doesnt exist",
                code:constants.HTTP_STATUS_NOT_FOUND
            })
        }

        const create = await Transaction.create({
            id: v4(),
            givenBy: null,
            takenBy: takenBy,
            isMoved: false,
            linenId: linenId,
            message: `LINEN ${findLinen.rfid} TELAH MASUK KE ${findUser.name}`
        });
        return responseApi({
            message: "SUCCESS SERVICE IN",
            data: create,
            code: constants.HTTP_STATUS_CREATED
        })
    } catch (e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionServiceLogTitle.ERROR,
            logMessage: e,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
};

const bulkServiceIn = async ({
    linenId = [],
    takenBy = ""
}) => {
    try{
        if(linenId.length === 0 || typeof linenId !== "object"){
            return responseApi({
                code: constants.HTTP_STATUS_BAD_REQUEST,
                message: "Linens should not be empty",
            });
        }
        let failedLinen = [];
        linenId.map(async(linen) => {
            const result = await serviceIn({linenId: linenId, takenBy: takenBy});
            if(result.code !== constants.HTTP_STATUS_OK){
                failedLinen.push(linen);
            }
        });

        return responseApi({
            data: {failedLinen},
            code: constants.HTTP_STATUS_OK,
            message: "Success create transactions"
        })
    }catch (e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionServiceLogTitle.ERROR,
            logMessage: e,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
}

module.exports = {
  serviceInOut,
  bulkServiceInOut,
  serviceIn,
  bulkServiceIn
};
