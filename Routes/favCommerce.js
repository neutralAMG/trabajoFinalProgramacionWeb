const router = require("express").Router();
const userfavCommereceController = require("../Controllers/userFavCommerceController");

router.get("/favCommerce-index", userfavCommereceController.GetAllUserFavCommerces);
router.post("/favCommerce-add", userfavCommereceController.PostAddUserFavCommerces);
router.post("/favCommerce-delete", userfavCommereceController.PostDeleteUserFavCommerces);

module.exports = router

