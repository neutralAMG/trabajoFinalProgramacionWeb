const router = require("express").Router()
const commereceTypeController = require("../Controllers/CommereceTypesController")
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/commerceType-mant", middlewares.AdminMiddleware, commereceTypeController.GetAllCommereceType);
router.get("/commerceType-add", middlewares.AdminMiddleware, commereceTypeController.GetAddCommereceType);
router.post("/commerceType-add", middlewares.AdminMiddleware, commereceTypeController.PostAddCommereceType);
router.get("/commerceType-edit/:id", middlewares.AdminMiddleware, commereceTypeController.GetEditCommereceType);
router.post("/commerceType-edit", middlewares.AdminMiddleware, commereceTypeController.PostEditCommereceType);
router.post("/commerceType-delete", middlewares.AdminMiddleware, commereceTypeController.PostDeleteCommereceType);


module.exports = router

