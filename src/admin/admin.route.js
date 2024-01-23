const { isMustAdmin, roleValidation } = require("../middleware/auth.middleware");
const { createRoleController } = require("./admin.controller");

const router = require("express").Router();

router.use(roleValidation)
router.use(isMustAdmin)
router.post("/", createRoleController)


module.exports = router