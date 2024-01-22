const { isMustAdmin } = require("../middleware/auth.middleware");
const { RelationalMiddleware } = require("../middleware/relational.middleware");
const { createTransactionController, serviceInOutController, serviceInController } = require("./transaction.controller");

const router = require("express").Router();


router.use(RelationalMiddleware)
// router.use(isMustAdmin)
router.post("/", createTransactionController)
router.post("/serviceInOut", serviceInOutController)
router.post("/serviceIn", serviceInController)


module.exports = router;
