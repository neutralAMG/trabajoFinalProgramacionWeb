const router = require("express").Router()
const productController = require("../Controllers/ProductController")

router.get("/prod-index", productController.GetAllProducts);
router.get("/prod-commerece-prod/:id", productController.GetAllProductsByCommerceId);
router.get("/prod-catergory/:id", productController.GetAllProductsByCategory);
router.get("/prod-detail/:id", productController.GetProductById);
router.get("/prod-add", productController.GetAddProduct);
router.post("/prod-add", productController.PostAddProduct);
router.get("/prod-edit/:id", productController.GetEditProduct);
router.post("/prod-edit", productController.PostEditProduct);
router.post("/prod-add-discount", productController.PostAddDiscoundProduct);
router.post("/prod-delete", productController.PostDeleteProduct);


module.exports = router

