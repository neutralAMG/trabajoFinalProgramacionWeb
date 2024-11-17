const router = require("express").Router()
const directionController = require("../Controllers/DirectionController")

router.get("/direction-index", directionController.GetAllUserDirection);
router.get("/direction-add", directionController.GetAddDirection);
router.post("/direction-add", directionController.PostAddDirection);
router.get("/direction-edit/:id", directionController.GetEditDirection);
router.post("/direction-edit", directionController.GetEditDirection);
router.post("/direction-delete", directionController.PostDeleteDirection);


module.exports = router

