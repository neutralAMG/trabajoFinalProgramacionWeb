const router = require("express").Router()
const commereceTypeController = require("../Controllers/CommereceTypesController")

router.get("/comerceType-index", commereceTypeController.GetAllCommereceType);
router.get("/comerceType-add", commereceTypeController.GetAddCommereceType);
router.post("/comerceType-add", commereceTypeController.PostAddCommereceType);
router.get("/comerceType-edit/:id", commereceTypeController.GetEditCommereceType);
router.post("/comerceType-edit", commereceTypeController.PostEditCommereceType);
router.post("/comerceType-delete", commereceTypeController.PostDeleteCommereceType);


module.exports = router

