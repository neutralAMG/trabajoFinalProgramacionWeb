const router = require("express").Router()
const userController = require("../Controllers/UserController")
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/user-client-mant",  middlewares.AdminMiddleware, userController.GetAllUserClientMant);
router.get("/user-delivery-mant", middlewares.AdminMiddleware, userController.GetAllUserDeliveryMant);
router.get("/user-employee-mant", middlewares.ManagerMiddleware, userController.GetAllUserDeliveryMant);
router.get("/user-admin-mant", middlewares.AdminMiddleware, userController.GetAllAdminUserMant);

router.get("/user-admin-add" , middlewares.AdminMiddleware, userController.GetAddAdmin);
router.post("/user-admin-add", middlewares.AdminMiddleware, userController.PostAddAdmin);
router.get("/user-edit/:id", userController.GetEditUser);
router.get("/user-admin-edit/:id", userController.GetEditAdmin);
router.post("/user-edit", userController.PostEditUser);
router.post("/user-admin-edit", userController.PostEditUserAdmin);
router.post("/user-delete", middlewares.AdminMiddleware, userController.PostDeleteUser);


module.exports = router

