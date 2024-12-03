
const {Roles,UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables")
module.exports = (req, res, next) =>{
    if(req.session.IsLogin){
        req.flash(UIMessagesNamesForFlash.InfoMessageName, "User is authenticated");
        return res.redirect(GetRoleHomeUrl(res.locals.UserInfo.RoleId));
    }
    next();
}

const GetRoleHomeUrl = (role) =>{
    let url; 
    if (role === Roles.Admin) {
        url =  "/home/home-admin";
    }else if (role === Roles.Delivery) {
        url =  "/home/home-delivery";
    }else if (role === Roles.Client) {
        url =  "/home/home-client";
    }else{
        //Commerece
        url =  "/home/home-commerece";
    }
    return url;
}