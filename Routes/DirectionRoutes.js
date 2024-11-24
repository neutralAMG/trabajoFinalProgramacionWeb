const router = require("express").Router()
const directionController = require("../Controllers/DirectionController")
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/direction-index", middlewares.ClientMiddleware, directionController.GetAllUserDirection);
router.get("/direction-add", middlewares.ClientMiddleware, directionController.GetAddDirection);
router.post("/direction-add", middlewares.ClientMiddleware, directionController.PostAddDirection);
router.get("/direction-edit/:id", middlewares.ClientMiddleware, directionController.GetEditDirection);
router.post("/direction-edit", middlewares.ClientMiddleware, directionController.GetEditDirection);
router.post("/direction-delete", middlewares.ClientMiddleware, directionController.PostDeleteDirection);


module.exports = router

