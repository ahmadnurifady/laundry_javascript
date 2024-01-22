const { v4 } = require("uuid");
const { Transaction } = require("./transaction.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const { TransactionServiceLogTitle, TransactionServiceErrorMessage } = require("./transaction.domain");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { Users } = require("../users/users.model");
const { Linens } = require("../linens/linen.model");
const { cast } = require("sequelize");



const createTransaction = async({ takenBy = "", isMoved = false, linenId = ""}) => {
    try {
        const create = await Transaction.create({
            id:  v4(),
            takenBy:takenBy,
            isMoved:isMoved,
            linenId: linenId,
        });
        return responseApi({
            message: "Success Create Transaction",
            data: create,
            code: constants.HTTP_STATUS_CREATED
        });

    }catch (e){
        logEvent(LOGTYPE.ERROR, {
            logTitle: TransactionServiceLogTitle.ERROR,
            logMessage: e.message,
          });
          return responseApi({
            code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: e.message,
          });
    }
};

const serviceInOut = async ({linenId = "", givenBy = "", takenBy = ""}) => {
    try{
        const findTX = await Transaction.findOne({where: {
            linenId: linenId,
            isMoved: false,
            takenBy: givenBy
        }});
        if(!findTX){
            return responseApi({
                code: constants.HTTP_STATUS_NOT_FOUND,
                message:TransactionServiceErrorMessage.NOT_FOUND
              })
        };

        const createTX = await Transaction.create({
            id: v4(),
            linenId: linenId,
            isMoved: true,
            takenBy: takenBy,
            givenBy: givenBy
        });
        return responseApi({
            message: "Success Transaction IN OUT",
            data: createTX,
            code: constants.HTTP_STATUS_CREATED
        });


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

const serviceIn = async ({takenBy = "", linenId = ""}) => {
    try{
        const create = await Transaction.create({
            id: v4(),
            givenBy: null,
            takenBy: takenBy,
            isMoved: false,
            linenId: linenId
        });
        return responseApi({
            message: "Success Create Transaction In",
            data: create,
            code: constants.HTTP_STATUS_CREATED
        });

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
}

module.exports =  {
    createTransaction,
    serviceInOut,
    serviceIn
}