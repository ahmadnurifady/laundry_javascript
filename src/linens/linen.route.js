const { createLinenController } = require("./linen.controller");

const router = require("express").Router();

router.post("/", createLinenController);

module.exports = router