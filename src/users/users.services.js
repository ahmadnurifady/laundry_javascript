const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { UserServiceLogTitle, UserServiceErrorMessage } = require("./users.domain");
const { Users } = require("./users.model");
const { responseApi } = require("../utils/response");
const { constants } = require("http2");
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const jwt =require("jsonwebtoken");
const { RoleUsers } = require("../role_user/role.user");

const login = async ({ username = "", password = "" }) => {
  try {

    const findUser = await Users.findOne({ where: { username: username } });
    if (!findUser) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, findUser.password)

    if (!isPasswordCorrect) {
      return responseApi({
        code: constants.HTTP_STATUS_UNAUTHORIZED,
        message: UserServiceErrorMessage.WRONG_CREDENTIALS,
      });
    }

    const token = jwt.sign({id: findUser.id}, process.env.JWT_SECRET,{
      expiresIn: process.env.REFRESH_EXPIRED,
    });


    return responseApi({
      message: "success login",
      code: constants.HTTP_STATUS_OK,
      data: {token : token} });



  } catch (e) {
    
    logEvent(LOGTYPE.ERROR, {
      logTitle: UserServiceLogTitle.ERROR,
      logMessage: e.ERROR,
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

const createUser = async ({username = "", password = "",roleUserId = 0, barcodeId = ""}) => {
  try {
    const checkUser = await Users.findOne({
      where: {
        username: username
      }
    })
    if(checkUser){
      return responseApi({
        message:"username is already in use",
        data: null,
        code: constants.HTTP_STATUS_BAD_REQUEST
      });
    };

    const checkRole = await RoleUsers.findByPk(roleUserId)
    if(!checkRole){
      return responseApi({
        message: "role is doesn't exist",
        code: constants.HTTP_STATUS_BAD_REQUEST,
      })
    };

    const checkBarcodeId = await Users.findOne({
      where: {
        barcodeId: barcodeId
      }
    });
    if(checkBarcodeId){
      return responseApi({
        message: "BarcodeId is already use",
        code: constants.HTTP_STATUS_BAD_REQUEST,
      })
    };

    
    const create = await Users.create({
      id: v4(),
      username: username,
      password : await bcrypt.hash(password, 15),
      roleUserId: roleUserId,
      barcodeId: barcodeId,
    });
    return responseApi({
      message: "success create user",
      data: create,
      code: constants.HTTP_STATUS_CREATED,
    });
  } catch (e) {
    console.log(e)
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

const updateUser = async(id,{username = "", password = "", barcodeId = ""}) => {
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
    findUser.barcodeId = barcodeId
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