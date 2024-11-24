const SessionManager = require("../Utils/SessionManager");
const {ErrorNameforFlash} = require("../Utils/ImportantENVVariables")
module.exports = (req, res, next) =>{
    if(!SessionManager(res)){
        req.flash(errorMessages, "User is not authenticated");
        return res.redirect("/account/authenticate");
    }
    next();
}