const { loginController, findIdUserController, createUserController, findAllUserController, updateUserController, deleteUserController } = require("./user.controller");
const router = require("express").Router();

router.post("/login", loginController);
router.get("/getAll", findAllUserController)
router.get("/:id", findIdUserController);
router.post("/", createUserController);
router.put("/update", updateUserController);
router.delete("/delete", deleteUserController);


module.exports = router;
