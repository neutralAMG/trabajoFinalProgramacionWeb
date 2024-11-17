const router = require("express").Router()
const categoryController = require("../Controllers/CategoryController")

router.get("/category-index", categoryController.GetAllCategory);
router.get("/category-add", categoryController.GetAddCategory);
router.post("/category-add", categoryController.PostAddCategory);
router.get("/category-edit/:id", categoryController.GetEditCategory);
router.post("/category-edit", categoryController.PostEditCategory);
router.post("/category-delete", categoryController.PostDeleteCategory);


module.exports = router

