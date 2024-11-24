const router = require("express").Router()
const productController = require("../Controllers/ProductController")
const isAuth = require("../Middlewares/IsAuth");
const middlewares = require("../Middlewares/Users-Middleware");


router.get("/prod-index", middlewares.CommereceMiddleware, productController.GetAllProducts);
router.get("/prod-commerece-prod/:id", middlewares.ClientMiddleware, productController.GetAllProductsByCommerceId);
router.get("/prod-catergory/:id", middlewares.ClientMiddleware, productController.GetAllProductsByCategory);
router.get("/prod-detail/:id", middlewares.CommereceMiddleware, productController.GetProductById);
router.get("/prod-add", middlewares.CommereceMiddleware, productController.GetAddProduct);
router.post("/prod-add", middlewares.CommereceMiddleware, productController.PostAddProduct);
router.get("/prod-edit/:id", middlewares.CommereceMiddleware,  productController.GetEditProduct);
router.post("/prod-edit", middlewares.CommereceMiddleware, productController.PostEditProduct);
router.post("/prod-add-discount", middlewares.ManagerMiddleware, productController.PostAddDiscoundProduct);
router.post("/prod-delete", middlewares.ManagerMiddleware, productController.PostDeleteProduct);


module.exports = router

