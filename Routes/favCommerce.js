const router = require("express").Router();
const userfavCommereceController = require("../Controllers/userFavCommerceController");

router.get("/fav-index", userfavCommereceController.GetAllUserFavCommerces);
router.post("/fav-add", userfavCommereceController.PostAddUserFavCommerces);
router.post("/fav-delete", userfavCommereceController.PostDeleteUserFavCommerces);

module.exports = router

