
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables")
module.exports = (req, res, next) =>{
    if(!req.session.IsLogin){
        req.flash(UIMessagesNamesForFlash.InfoMessageName, "User is not authenticated");
        return res.redirect("/account/authenticate");
    }
    next();
}
