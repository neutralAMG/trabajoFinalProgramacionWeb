const isAuth = require("./IsAuth");
const isActive = require("./IsAuth");
const createCommerece = require("./needToCreateCommerece");
const noNeddCreateCommerece = require("./commereceIsCreated");
const {Roles, UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");

const RoleMiddle = (AllowRoles) =>{ 
    return [
        isAuth, 
        (req, res, next) =>{ 
            if (!AllowRoles.includes(res.locals.UserInfo.RoleId)  ) {
                req.flash(UIMessagesNamesForFlash.InfoMessageName, "You are not authorized to view this content");
                return res.redirect("..");
            };
          next();
        }
    ]
}

exports.AdminMiddleware = RoleMiddle([Roles.Admin])

exports.ImportantUsersMiddleware = RoleMiddle([Roles.Admin, Roles.Manager])



exports.ClientMiddleware = RoleMiddle([Roles.Client])


exports.DeliveryMiddleware = RoleMiddle([Roles.Delivery])

const middlewareCommerece = RoleMiddle([Roles.Manager])
exports.ManagerMiddleware =  [middlewareCommerece[0], createCommerece, middlewareCommerece[1]]
exports.ManagerMiddlewareWithCommerece = [middlewareCommerece[0], noNeddCreateCommerece, middlewareCommerece[1]]

const middlewaresCommerece = RoleMiddle([Roles.Manager,Roles.Employee]);
exports.CommereceMiddleware =  [middlewaresCommerece[0], createCommerece, middlewaresCommerece[1]]

