const router = require("express").Router()
const orderController = require("../Controllers/OrderController")

router.get("/order-index", orderController.GetAllOrders);
router.get("/order-detail/:id", orderController.GetOrderDetail);
router.get("/order-add", orderController.GetAddOrder);
router.post("/order-add", orderController.PostAddOrder);
router.post("/order-update-status", orderController.PostUpdateOrderStatus);
router.post("/order-Assing", orderController.PostAssingOrder);



module.exports = router

