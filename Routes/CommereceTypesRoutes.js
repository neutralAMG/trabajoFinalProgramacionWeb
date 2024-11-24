const router = require("express").Router()
const commereceTypeController = require("../Controllers/CommereceTypesController")
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/comerceType-index", middlewares.AdminMiddleware, commereceTypeController.GetAllCommereceType);
router.get("/comerceType-add", middlewares.AdminMiddleware, commereceTypeController.GetAddCommereceType);
router.post("/comerceType-add", middlewares.AdminMiddleware, commereceTypeController.PostAddCommereceType);
router.get("/comerceType-edit/:id", middlewares.AdminMiddleware, commereceTypeController.GetEditCommereceType);
router.post("/comerceType-edit", middlewares.AdminMiddleware, commereceTypeController.PostEditCommereceType);
router.post("/comerceType-delete", middlewares.AdminMiddleware, commereceTypeController.PostDeleteCommereceType);


module.exports = router

