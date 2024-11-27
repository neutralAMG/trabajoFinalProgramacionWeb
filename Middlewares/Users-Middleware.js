const isAuth = require("./IsAuth");
const isActive = require("./IsAuth");
const createCommerece = require("./needToCreateCommerece");
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

const middlewares = RoleMiddle([Roles.Manager]);
exports.ManagerMiddleware = [middlewares[0], createCommerece, middlewares[1]]


exports.CommereceMiddleware = RoleMiddle([Roles.Manager,Roles.Employee])

