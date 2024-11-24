const router = require("express").Router()
const userController = require("../Controllers/UserController");
const middlewares = require("../Middlewares/Users-Middleware");
router.get("/home-client",middlewares.ClientMiddleware, userController.GetAllUserClientMant);
router.get("/home-delivery",middlewares.DeliveryMiddleware, userController.GetAllUserDeliveryMant);
router.get("/home-admin",middlewares.AdminMiddleware, userController.GetAllAdminUserMant)
router.get("/home-commerece", middlewares.CommereceMiddleware, userController.GetEditUser);



module.exports = router

