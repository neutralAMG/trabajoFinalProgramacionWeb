const router = require("express").Router()
const orderController = require("../Controllers/OrderController");
const middlewares = require("../Middlewares/Users-Middleware")
const IsAuth = require("../Middlewares/IsAuth")



router.get("/order-index", IsAuth,orderController.GetAllUserOrders);
router.get("/order-detail/:id", IsAuth, orderController.GetOrderDetail);
router.get("/order-add/:id", middlewares.ClientMiddleware,  orderController.GetAddOrder);
router.post("/order-add", middlewares.ClientMiddleware, orderController.PostAddOrder);
router.post("/order-update-status", orderController.PostUpdateOrderStatus);
router.post("/order-Assing", middlewares.CommereceMiddleware, orderController.PostAssingOrder);



module.exports = router

