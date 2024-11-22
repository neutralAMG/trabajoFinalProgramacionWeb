const accountRoutes = require("../Routes/AccountRoutes");
const categoryRoutes = require("../Routes/CategoryRoutes");
const commereceRoutes = require("../Routes/CommerceRoutes");
const commereceTypeRoutes = require("../Routes/CommereceTypesRoutes");
const configurationRoutes = require("../Routes/ConfigurationController");
const directionRoutes = require("../Routes/DirectionRoutes");
const favCommerceRoutes = require("../Routes/favCommerce");
const orderRoutes = require("../Routes/OrderRoutes");
const productRoutes = require("../Routes/ProductRoutes");
const userRoutes = require("../Routes/UserRoutes");
const homeRoutes = require("../Routes/HomeRoutes");

exports.Register = (express) =>{
    express.use("/account", accountRoutes);
    express.use("/category", categoryRoutes);
    express.use("/commerece", commereceRoutes);
    express.use("/commereceType", commereceTypeRoutes);
    express.use("/configuration", configurationRoutes);
    express.use("/direction", directionRoutes);
    express.use("/favCommerce", favCommerceRoutes);
    express.use("/order", orderRoutes);
    express.use("/product", productRoutes);
    express.use("/user", userRoutes);
    express.use("/home", homeRoutes);
}


