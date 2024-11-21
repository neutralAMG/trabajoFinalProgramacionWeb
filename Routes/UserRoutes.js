const router = require("express").Router()
const userController = require("../Controllers/UserController")

router.get("/order-mant", userController.GetAllUserMant);
router.get("/order-admin-mant", userController.GetAllAdminUserMant)
router.get("/order-edit", userController.GetEditUser);
router.post("/order-edit", userController.PostEditUser);
router.post("/order-delete", userController.PostDeleteUser);


module.exports = router

