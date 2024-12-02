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

router.post("/change-active-state",middlewares.ImportantUsersMiddleware, accountController.PostChangeActiveState);

router.post("/change-role",middlewares.ManagerMiddleware, accountController.PostChangeEmployeeRole);
router.get("/reset-password", isNotAuth, accountController.GetReset);
router.post("/reset-password", isNotAuth, accountController.PostReset);
router.get("/reset-password/:token", isNotAuth, accountController.GetNewPassword);
router.post("/new-password",  isNotAuth, accountController.PostNewPassword);
router.get("/activate-user/:id", isNotAuth, accountController.GetActivateUser);
router.post("/activate-user/", isNotAuth, accountController.PostActivateUser);

module.exports = router