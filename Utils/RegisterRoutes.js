const accountRoutes = require("../Routes/AccountRoutes")

exports.Register = (express) =>{
    express.use("/account", accountRoutes)
}


