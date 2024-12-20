const router = require("express").Router()
const userController = require("../Controllers/UserController")
const middlewares = require("../Middlewares/Users-Middleware");
const isAuth = require("../Middlewares/IsAuth");

router.get("/user-client-mant",  middlewares.AdminMiddleware, userController.GetAllUserClientMant);
router.get("/user-delivery-mant", middlewares.AdminMiddleware, userController.GetAllUserDeliveryMant);
router.get("/user-employee-mant", middlewares.ManagerMiddleware, userController.GetAllEmployeeUserMant);
router.get("/user-admin-mant", middlewares.AdminMiddleware, userController.GetAllAdminUserMant);

router.get("/user-admin-add" , middlewares.AdminMiddleware, userController.GetAddAdmin);
router.post("/user-admin-add", middlewares.AdminMiddleware, userController.PostAddAdmin);

router.get("/user-employee-add" , middlewares.ManagerMiddleware, userController.GetAddEmployee);
router.post("/user-employee-add", middlewares.ManagerMiddleware, userController.PostAddEmployee);

router.get("/user-edit/:id", isAuth, userController.GetEditUser);
router.get("/user-admin-edit/:id", userController.GetEditAdmin);
router.post("/user-edit", isAuth,  userController.PostEditUser);

router.post("/user-admin-edit", userController.PostEditUserAdmin);
router.post("/user-delete", middlewares.AdminMiddleware, userController.PostDeleteUser);


module.exports = router

