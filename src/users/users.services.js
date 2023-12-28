const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserServiceLogTitle, UserServiceErrorMessage } = require("./users.domain");
const { Users } = require("./users.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const bcrypt = require("bcrypt");
const {v4} = require("uuid");

const login = async ({ username = "", password = "" }) => {
  try {
    const findUser = await Users.findOne({ where: { username: username } });
    if (!findUser) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }
    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      finduser.password
    );

    if (!isPasswordCorrect) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }
    return responseApi({ code: constants.HTTP_STATUS_OK, data: findUser });

  } catch (e) {
    
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};


const findUserById = async (id) => {
  try {
    const findIdUser = await Users.findByPk(id);
    if(!findIdUser){
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: UserServiceErrorMessage.NOT_FOUND
      })
    };
    return responseApi({
      message: "success get user by id",
      data: findIdUser,
      code: constants.HTTP_STATUS_OK
    })
  }
  catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
}

const createUser = async ({username = "", password = ""}) => {
  try {
    const create = await Users.create({username: username, password : password, id: v4()})
    return responseApi({
      message: "success create user",
      data: create,
      code: constants.HTTP_STATUS_CREATED
    })
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const findAll = async() => {
  try {
    const findAllUser = await Users.findAll()

    return responseApi({
      message: "success get all user",
      data: findAllUser,
      code: constants.HTTP_STATUS_OK
    });
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

const updateUser = async(id,{username = "", password = ""}) => {
  try {
    const findUser = await Users.findByPk(id)
    if(!findUser){
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: UserServiceErrorMessage.NOT_FOUND
      });
    };
    findUser.username = username
    findUser.password = password
    findUser.save()

    return responseApi({
      message: "success update user",
      data: {},
      code: constants.HTTP_STATUS_OK
    });
  } catch (e) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  };
};

const deleteUser = async(id) => {
  try{
    const findUser = await Users.findByPk(id);
    if(!findUser){
      return responseApi({
        code: constants.HTTP_STATUS_NOT_FOUND,
        message: UserServiceErrorMessage.NOT_FOUND
      });
    };

    findUser.destroy()

    return responseApi({
      message: "success delete user",
      data: {},
      code: constants.HTTP_STATUS_OK
    })
  }catch (e){
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.message,
    });
    return responseApi({
      code: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
}

module.exports = {
    login,
    findUserById,
    createUser,
    findAll,
    updateUser,
    deleteUser
}