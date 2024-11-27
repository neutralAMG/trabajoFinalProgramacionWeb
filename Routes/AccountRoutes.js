const router = require("express").Router()
const accountController = require("../Controllers/AccountController");
const isAuth = require("../Middlewares/IsAuth");
const isNotAuth = require("../Middlewares/isNotAuth");
const middlewares = require("../Middlewares/Users-Middleware");


router.get("/authenticate", isNotAuth, accountController.GetAuthenticate);
router.post("/authenticate", isNotAuth, accountController.PostAuthenticate);
router.post("/unAuthenticate", isAuth ,accountController.PostUnAuthenticate);
router.get("/register", isNotAuth, accountController.GetRegister);
router.post("/register", isNotAuth, accountController.PostRegister);
router.post("/change-active-state",middlewares.AdminMiddleware, accountController.PostChangeActiveState);
router.get("/reset-password", isNotAuth, accountController.GetReset);
router.get("/reset-password/:token", isNotAuth, accountController.GetReset);
router.get("/reset-password", isNotAuth, accountController.GetNewPassword);
router.post("/reset-password",  isNotAuth, accountController.PostNewPassword);
router.post("/activate-user/:id", isNotAuth, accountController.PostNewPassword);

module.exports = router