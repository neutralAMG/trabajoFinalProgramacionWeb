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


exports.ManagerMiddleware = RoleMiddle([Roles.Manager])

const middlewaresCommerece = RoleMiddle([Roles.Manager,Roles.Employee]);
exports.CommereceMiddleware =  [middlewaresCommerece[0], createCommerece, middlewaresCommerece[1]]

