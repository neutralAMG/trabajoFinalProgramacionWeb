const router = require("express").Router()
const accountController = require("../Controllers/AccountController")

router.get("/authenticate", accountController.GetAuthenticate);
router.post("/authenticate", accountController.PostAuthenticate);
router.get("/register", accountController.GetRegister);
router.post("/register", accountController.PostRegister);
router.post("/change-active-state/:id", accountController.PostChangeActiveState);


module.exports = router