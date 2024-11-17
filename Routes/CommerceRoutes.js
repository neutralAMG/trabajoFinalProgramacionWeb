const router = require("express").Router()
const commereceController = require("../Controllers/CommerceController")

router.get("/comerce-mant", commereceController.GetAllCommerece);
router.get("/comerce-index/:cTypeId", commereceController.GetAllCommereceByCommerceType);
router.get("/comerce-add", commereceController.GetAddCommerece);
router.post("/comerce-add", commereceController.PostAddCommerece);
router.get("/comerce-edit/:id", commereceController.GetEditCommerece);
router.post("/comerce-edit", commereceController.PostEditCommerece);
router.post("/comerce-change-active-status/:id", commereceController.PostChangeActiveStateCommerece);


module.exports = router

