const { RelationalMiddleware } = require("../middleware/relational.middleware");
const { createTransactionController, serviceInOutController } = require("./transaction.controller");

const router = require("express").Router();


router.use(RelationalMiddleware)
router.post("/", createTransactionController)
router.post("/serviceInOut", serviceInOutController)



module.exports = router;
