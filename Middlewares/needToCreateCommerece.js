const SessionManager = require("../Utils/SessionManager");
const {Roles,ErrorNameforFlash} = require("../Utils/ImportantENVVariables")

module.exports = (req, res, next) =>{
    if((res.locals.UserInfo.RoleId === Roles.Employee || res.locals.UserInfo.RoleId === Roles.Manager) && !res.locals.UserInfo.CommerceId){
        req.flash(ErrorNameforFlash, "Please create your commerece")
       return res.redirect("/commerece/commerce-add");
    }    
    next();
}


