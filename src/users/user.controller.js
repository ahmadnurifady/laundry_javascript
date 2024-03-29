const { constants } = require("http2");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserControllerLogTitle } = require("./users.domain");
const { login, findUserById, createUser, findAll, updateUser, deleteUser, changePassword, changeBarcodeId, findUserByBarcode } = require("./users.services");

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await login({ username: username, password: password });
    return res.status(result.code).send(result);
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(err.message);
  }
};

const findIdUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findUserById(id)
    return res.status(result.code).send(result)
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .status(err.message)
  }
};

const findUserByBarcodeController  = async (req, res, next) => {
  try{
    const {barcodeId} = req.body;
    const result = await findUserByBarcode(barcodeId);
    return res.status(result.code).send(result)
  } catch (err){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .status(err.message)
  }
}

const createUserController = async (req, res, next) => {
  try {
    const { name, username, password, roleUserId, barcodeId } = req.body;
    const result = await createUser({ name: name, username: username, password: password, roleUserId : roleUserId, barcodeId: barcodeId })
    return res.status(result.code).send(result)
    
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .status(err.message)
  }
};

const findAllUserController = async (req ,res, next) => {
  try{
    const result = await findAll()
    return res.status(result.code).send(result)
  }catch (err){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .status(err.message)
  }
};

const changePasswordController = async(req, res, next) => {
  try{
    const {id, password} = req.body;
    const result = await changePassword(id, password)
    return res.status(result.code).send(result)
  }catch (err){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .status(err.message)
  }
};

const changeBarcodeIdController = async(req, res, next) => {
  try{
    const {id, barcodeId} = req.body;
    const result = await changeBarcodeId(id, barcodeId)
    return res.status(result.code).send(result)

  } catch (err){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .status(err.message)
  }
}

const deleteUserController = async (req, res, next) => {
  try{
    const {id} = req.body;
    const result = await deleteUser(id)
    return res.status(result.code).send(result)
  }catch (err){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserControllerLogTitle.ERROR,
      logMessage: err.message,
    });
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .status(err.message)
  }

}


module.exports = {
  loginController,
  findIdUserController,
  findUserByBarcodeController,
  createUserController,
  findAllUserController,
  changePasswordController,
  deleteUserController,
  changeBarcodeIdController
}
