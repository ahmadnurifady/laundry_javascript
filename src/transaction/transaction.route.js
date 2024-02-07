// const { isMustAdmin } = require("../middleware/auth.middleware");
const { RelationalMiddleware } = require("../middleware/relational.middleware");
const {
  serviceInOutController,
  startTransactionController,
  returnTransactionController,
} = require("./transaction.controller");

const router = require("express").Router();

router.use(RelationalMiddleware);
router.post("/serviceInOut", serviceInOutController);
router.post("/complete-transaction", returnTransactionController);
router.post("/start-transaction", startTransactionController);

module.exports = router;
