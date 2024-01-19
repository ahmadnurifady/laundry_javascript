const { roleValidation } = require("../middleware/auth.middleware");
const { loginController, findIdUserController, createUserController, findAllUserController, deleteUserController, changePasswordController, changeBarcodeIdController, findUserByBarcodeController } = require("./user.controller");
const router = require("express").Router();

router.post("/login", loginController);
router.post("/", createUserController);
router.use(roleValidation)
router.get("/getAll", findAllUserController)
router.post("/barcode", findUserByBarcodeController)
router.get("/:id", findIdUserController);
router.put("/change-password", changePasswordController);
router.put("/change-barcode", changeBarcodeIdController)
router.delete("/delete", deleteUserController);


module.exports = router;
