const { roleValidation } = require("../middleware/auth.middleware");
const { loginController, findIdUserController, createUserController, findAllUserController, updateUserController, deleteUserController, changePasswordController, changeBarcodeIdController } = require("./user.controller");
const router = require("express").Router();

router.post("/login", loginController);
router.post("/", createUserController);
router.use(roleValidation)
router.get("/getAll", findAllUserController)
router.get("/:id", findIdUserController);
router.put("/change-password", changePasswordController);
router.put("/change-barcode", changeBarcodeIdController)
router.delete("/delete", deleteUserController);


module.exports = router;
