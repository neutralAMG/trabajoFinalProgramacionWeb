const SessionManager = require("../Utils/SessionManager");
const {ErrorNameforFlash} = require("../Utils/ImportantENVVariables")
module.exports = (req, res, next) =>{
    if(SessionManager.IsLogin(res)){
        req.flash(ErrorNameforFlash, "User is authenticated");
        return res.redirect("/account/authenticate");
    }
    next();
}