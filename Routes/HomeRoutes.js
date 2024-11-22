const router = require("express").Router()
const userController = require("../Controllers/UserController")

router.get("/home-client", userController.GetAllUserClientMant);
router.get("/home-delivery", userController.GetAllUserDeliveryMant);
router.get("/home-admin", userController.GetAllAdminUserMant)
router.get("/home-commerece", userController.GetEditUser);



module.exports = router

