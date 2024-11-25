const router = require("express").Router()
const commereceController = require("../Controllers/CommerceController");

router.get("/commerce-mant", commereceController.GetAllCommerece);
router.get("/commerce-index/:cTypeId", commereceController.GetAllCommereceByCommerceType);
router.get("/commerce-add", commereceController.GetAddCommerece);
router.post("/commerce-add", commereceController.PostAddCommerece);
router.get("/commerce-edit/:id", commereceController.GetEditCommerece);
router.post("/commerce-edit", commereceController.PostEditCommerece);
router.post("/commerce-change-active-status/:id", commereceController.PostChangeActiveStateCommerece);


module.exports = router

