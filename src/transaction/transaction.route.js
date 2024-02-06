// const { isMustAdmin } = require("../middleware/auth.middleware");
const { RelationalMiddleware } = require("../middleware/relational.middleware");
const {
  createTransactionController,
  serviceInOutController,
  completeTransactioController,
  startTransactionController,
} = require("./transaction.controller");

const router = require("express").Router();

router.use(RelationalMiddleware);
router.post("/serviceInOut", serviceInOutController);
router.post("/complete-transaction", completeTransactioController);
// router.post("/serviceIn", serviceInController)
router.post("/start-transaction", startTransactionController);

module.exports = router;
