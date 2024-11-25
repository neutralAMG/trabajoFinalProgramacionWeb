const isNotAuth = require("./isNotAuth");
const SessionManager = require("../Utils/SessionManager");
const {Roles} = require("../Utils/ImportantENVVariables");

const RoleMiddle = (AllowRoles) =>{ 
    return [
        isNotAuth, 
        (req, res, next) =>{ 
            if (!AllowRoles.includes(req.user.RoleId)  ) {
                req.flash(ErrorNameforFlash, "You are not authorized to view this content");
                return res.redirect("..");
            };
            next();
        }
    ]
}

exports.AdminMiddleware = RoleMiddle([Roles.Admin])



exports.ClientMiddleware = RoleMiddle([Roles.Client])


exports.DeliveryMiddleware = RoleMiddle([Roles.Delivery])


exports.ManagerMiddleware = RoleMiddle([Roles.Manager])


exports.CommereceMiddleware = RoleMiddle([Roles.Manager,Roles.Employee])

