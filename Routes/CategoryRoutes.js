const router = require("express").Router()
const categoryController = require("../Controllers/CategoryController")
const isAuth = require("../Middlewares/IsAuth");
const middlewares = require("../Middlewares/Users-Middleware");

router.get("/category-mant", middlewares.CommereceMiddleware,categoryController.GetAllCategory);
router.get("/category-add",middlewares.CommereceMiddleware, categoryController.GetAddCategory);
router.post("/category-add",middlewares.CommereceMiddleware, categoryController.PostAddCategory);
router.get("/category-edit/:id",middlewares.CommereceMiddleware, categoryController.GetEditCategory);
router.post("/category-edit",middlewares.CommereceMiddleware, categoryController.PostEditCategory);
router.post("/category-delete",middlewares.CommereceMiddleware, categoryController.PostDeleteCategory);


module.exports = router

