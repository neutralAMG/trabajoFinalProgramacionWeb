const router = require("express").Router()
const configurationController = require("../Controllers/ConfigurationController")

router.get("/configuration-index", configurationController.GetAllConfiguration);
router.get("/configuration-edit/:id", configurationController.GetEditConfiguration);
router.get("/configuration-edit", configurationController.PostEditConfiguration);



module.exports = router

