const { RelationalTX } = require("../middleware/relational.middleware");
const { createTransactionController } = require("./transaction.controller");

const router = require("express").Router();


router.use(RelationalTX)
router.post("/", createTransactionController)



module.exports = router;
