const isAuth = require("./IsAuth");
const {Roles} = require("../Utils/ImportantENVVariables");

const RoleMiddle = (AllowRoles) =>{ 
    return [
        isAuth, 
        (req, res, next) =>{ 
            if (!AllowRoles.includes(res.locals.UserInfo.RoleId)  ) {
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

