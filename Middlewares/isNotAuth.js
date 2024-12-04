const GetRoleHomeUrl = require("../Utils/GetRoleHomeUrl")
const {Roles,UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables")
module.exports = (req, res, next) =>{
    if(req.session.IsLogin){
        req.flash(UIMessagesNamesForFlash.InfoMessageName, "User is authenticated");
        return res.redirect(GetRoleHomeUrl(res.locals.UserInfo.RoleId));
    }
    next();
}
