const { loginController } = require("./user.controller");
const router = require("express").Router();

router.post("/login", loginController);

module.exports = router;
