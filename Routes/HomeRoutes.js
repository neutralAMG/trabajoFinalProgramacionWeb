const router = require("express").Router()

const homeController = require("../Controllers/HomeController");
const middlewares = require("../Middlewares/Users-Middleware");
router.get("/home-client",middlewares.ClientMiddleware, homeController.GetClientHome);
router.get("/home-delivery",middlewares.DeliveryMiddleware, homeController.GetDeliveryHome);
router.get("/home-admin",middlewares.AdminMiddleware, homeController.GetAdminHome)
router.get("/home-commerece", middlewares.CommereceMiddleware, homeController.GetCommereceHome);



module.exports = router

