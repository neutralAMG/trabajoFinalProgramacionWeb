const SessionManager = require("../Utils/SessionManager");
const {Roles} = require("../Utils/ImportantENVVariables")

module.exports = (req, res, next) =>{
    if((SessionManager(res).RoleId === Roles.Employee || SessionManager(res).RoleId === Roles.Manager) && !SessionManager(res).CommerceId)
        res.redirect("/commerce/commerce-add");
    next();
}