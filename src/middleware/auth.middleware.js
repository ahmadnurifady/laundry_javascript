const { Users } = require("../users/users.model");
const { constants } = require("http2");
const jwt = require("jsonwebtoken");
const { logEvent } = require("../logger/logger");
const { LOGTYPE } = require("../logger/logger.domain");
const { responseApi } = require("../utils/response");
const { AuthMiddlewareLogTitle } = require("./auth.middle.domain");
const { RoleUsers } = require("../role_user/role.user");



const roleValidation = async (req, res, next) => {
  const { authorization } = req.headers;
  const responseUnauthorized = responseApi({
    code: constants.HTTP_STATUS_FORBIDDEN,
    message: "UNAUTHORIZED",
  });

  if (!authorization) {
    return res.status(responseUnauthorized.code).send(responseUnauthorized);
  }
  try {
    const bearerToken = authorization.slice(7);
    const { id } = jwt.verify(bearerToken, process.env.JWT_SECRET);

    const findUser = await Users.findByPk(id);
    if (!findUser) {
      return res.status(responseUnauthorized.code).send(responseUnauthorized);
    }
    next();
  } catch (err) {
    logEvent(LOGTYPE.ERROR, {
      logTitle: AuthMiddlewareLogTitle.ERROR,
      logMessage: err.message,
    });

    const responseError = responseApi({
      code: constants.HTTP_STATUS_FORBIDDEN,
      message: err.message,
    });

        return res
            .status(responseError.code)
            .send(responseError)
    }
};

const isMustAdmin = async(req, res, next) => {
    const { authorization } = req.headers;
    const responseUnauthorized = responseApi({
        code: constants.HTTP_STATUS_FORBIDDEN,
        message: 'UNAUTHORIZED MUST ADMIN'
    });
    try{
        const bearerToken = authorization.slice(7);
        const {id} = jwt.verify(bearerToken, process.env.JWT_SECRET);

        const findUser = await Users.findByPk(id);
        if (!findUser) {
            return res.status(responseUnauthorized.code).send(responseUnauthorized)
        }

        const findRole = await RoleUsers.findByPk(findUser.roleUserId)
        if(findRole.role === "admin"){
            return next()
        }
            return res.status(responseUnauthorized.code).send(responseUnauthorized)
    }catch (err){
        logEvent(LOGTYPE.ERROR, {
            logTitle: AuthMiddlewareLogTitle.ERROR,
            logMessage: err.message,
        });

        const responseError = responseApi({
            code: constants.HTTP_STATUS_FORBIDDEN,
            message: err.message
        })

        return res
            .status(responseError.code)
            .send(responseError)
    }
}

module.exports = {
    roleValidation,
    isMustAdmin
}