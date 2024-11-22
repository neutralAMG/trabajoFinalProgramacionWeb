const router = require("express").Router()
const userController = require("../Controllers/UserController")

router.get("/user-client-mant", userController.GetAllUserClientMant);
router.get("/user-delivery-mant", userController.GetAllUserDeliveryMant);
router.get("/user-admin-mant", userController.GetAllAdminUserMant)
router.get("/user-edit", userController.GetEditUser);
router.post("/user-edit", userController.PostEditUser);
router.post("/user-delete", userController.PostDeleteUser);


module.exports = router

