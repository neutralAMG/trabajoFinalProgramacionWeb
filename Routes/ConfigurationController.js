const router = require("express").Router()
const configurationController = require("../Controllers/ConfigurationController");
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/configuration-index", middlewares.AdminMiddleware, configurationController.GetAllConfiguration);
router.get("/configuration-edit/:id", middlewares.AdminMiddleware, configurationController.GetEditConfiguration);
router.get("/configuration-edit", middlewares.AdminMiddleware, configurationController.PostEditConfiguration);



module.exports = router

