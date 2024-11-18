const SessionManager = require("../Utils/SessionManager");

module.exports = (req, res, next) =>{
    if(!SessionManager(req))
        return redirect("/");
    
    next();
}