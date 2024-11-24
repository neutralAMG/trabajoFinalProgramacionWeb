const SessionManager = require("../Utils/SessionManager");

module.exports = (req, res, next) =>{
    if(!SessionManager(res))
        return redirect("/");
    
    next();
}