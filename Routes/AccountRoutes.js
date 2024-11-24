const router = require("express").Router()
const accountController = require("../Controllers/AccountController");
const isAuth = require("../Middlewares/IsAuth");
const middlewares = require("../Middlewares/Users-Middleware");


router.get("/authenticate", accountController.GetAuthenticate);
router.post("/authenticate", accountController.PostAuthenticate);
router.post("/unAuthenticate", isAuth ,accountController.PostUnAuthenticate);
router.get("/register", accountController.GetRegister);
router.post("/register", accountController.PostRegister);
router.post("/change-active-state/:id",middlewares.AdminMiddleware, accountController.PostChangeActiveState);


module.exports = router