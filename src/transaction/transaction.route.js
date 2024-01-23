const { isMustAdmin } = require("../middleware/auth.middleware");
const { RelationalMiddleware } = require("../middleware/relational.middleware");
const { serviceInOutController, serviceInController } = require("./transaction.controller");

const router = require("express").Router();


router.use(RelationalMiddleware)
router.post("/serviceInOut", serviceInOutController)
router.post("/serviceIn", serviceInController)


module.exports = router;
