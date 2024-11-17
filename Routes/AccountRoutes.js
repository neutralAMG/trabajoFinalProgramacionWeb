const router = require("express").Router()
const accountController = require("../Controllers/AccountController")

router.get("/authenticate", accountController.GetAuthenticate);
router.get("/authenticate", accountController.PostAuthenticate);
router.get("/register", accountController.GetRegister);
router.get("/register", accountController.PostRegister);


module.exports = router