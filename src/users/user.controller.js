const { constants } = require("http2");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserControllerLogTitle } = require("./users.domain");
const { login, findUserById, createUser, findAll, updateUser, deleteUser } = require("./users.services");

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

const createUserController = async (req, res, next) => {
  try {
    const { username, password, roleUserId } = req.body;
    console.log("controller",roleUserId)
    const result = await createUser({ username: username, password: password, roleUserId : roleUserId })
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

const updateUserController = async(req, res, next) => {
  try{
    const loginId = req.userId;
    console.log(loginId)
    const {id, username, password} = req.body;
    const result = await updateUser(loginId,{username:username, password:password})
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
  createUserController,
  findAllUserController,
  updateUserController,
  deleteUserController
}
