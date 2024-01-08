const { createTransactionController } = require("./transaction.controller");

const router = require("express").Router();

router.post("/", createTransactionController)



module.exports = router;
