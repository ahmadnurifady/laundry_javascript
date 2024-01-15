const { RelationalMiddleware } = require("../middleware/relational.middleware");
const { createTransactionController } = require("./transaction.controller");

const router = require("express").Router();


router.use(RelationalMiddleware)
router.post("/", createTransactionController)



module.exports = router;
