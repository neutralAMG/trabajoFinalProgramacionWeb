const router = require("express").Router();
const userfavCommereceController = require("../Controllers/userFavCommerceController");
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/favCommerce-index", middlewares.ClientMiddleware, userfavCommereceController.GetAllUserFavCommerces);
router.post("/favCommerce-add", middlewares.ClientMiddleware, userfavCommereceController.PostAddUserFavCommerces);
router.post("/favCommerce-delete", middlewares.ClientMiddleware, userfavCommereceController.PostDeleteUserFavCommerces);

module.exports = router

