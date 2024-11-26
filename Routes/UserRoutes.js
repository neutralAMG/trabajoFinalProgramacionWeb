const router = require("express").Router()
const userController = require("../Controllers/UserController")
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/user-client-mant",  middlewares.AdminMiddleware, userController.GetAllUserClientMant);
router.get("/user-delivery-mant", middlewares.AdminMiddleware, userController.GetAllUserDeliveryMant);
router.get("/user-employee-mant", middlewares.ManagerMiddleware, userController.GetAllUserDeliveryMant);
router.get("/user-admin-mant", middlewares.AdminMiddleware, userController.GetAllAdminUserMant);
//TODO: implement this
router.get("/user-admin-add", userController.GetEditUser);
router.post("/user-admin-add", userController.PostEditUser);
router.get("/user-edit/:id", userController.GetEditUser);
router.post("/user-edit", userController.PostEditUser);
router.post("/user-delete", middlewares.AdminMiddleware, userController.PostDeleteUser);


module.exports = router

