const {Roles,UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables")


module.exports = (req, res, next) =>{
    if((res.locals.UserInfo.RoleId === Roles.Employee || res.locals.UserInfo.RoleId === Roles.Manager) && res.locals.UserInfo.CommerceId){
        req.flash(UIMessagesNamesForFlash.InfoMessageName, "You allready have a commerece registerd")
       return res.redirect("/home/home-commerece");
    }    
    next();
}