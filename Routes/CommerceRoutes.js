const router = require("express").Router()
const commereceController = require("../Controllers/CommerceController");

const middlewares = require("../Middlewares/Users-Middleware");
router.get("/commerce-mant", middlewares.AdminMiddleware, commereceController.GetAllCommerece);
router.get("/commerce-index/:cTypeId", middlewares.ClientMiddleware, commereceController.GetAllCommereceByCommerceType);
router.get("/commerce-add", middlewares.ManagerMiddlewareWithCommerece, commereceController.GetAddCommerece);
router.post("/commerce-add", middlewares.ManagerMiddlewareWithCommerece, commereceController.PostAddCommerece);
router.get("/commerce-edit/:id", middlewares.ManagerMiddleware, commereceController.GetEditCommerece);
router.post("/commerce-edit", middlewares.ManagerMiddleware, commereceController.PostEditCommerece);
router.post("/commerce-change-active-status",middlewares.AdminMiddleware, commereceController.PostChangeActiveStateCommerece);


module.exports = router

