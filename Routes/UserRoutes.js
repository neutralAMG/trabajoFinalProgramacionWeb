const router = require("express").Router()
const userController = require("../Controllers/UserController")

router.get("/order-index", userController.GetAllUserMant);
router.get("/order-admin-index", userController.GetAllAdminUserMant)
router.get("/order-edit", userController.GetEditUser);
router.post("/order-edit", userController.PostEditUser);
router.post("/order-delete", userController.PostDeleteUser);


module.exports = router

