const SessionManager = require("../Utils/SessionManager");
const {Roles,ErrorNameforFlash} = require("../Utils/ImportantENVVariables")

module.exports = (req, res, next) =>{
    if((SessionManager(res).RoleId === Roles.Employee || SessionManager(res).RoleId === Roles.Manager) && !SessionManager(res).CommerceId){
        req.flash(errorMessages, "Please create your commerece")
       return res.redirect("/commerce/commerce-add");
    }    
    next();
}