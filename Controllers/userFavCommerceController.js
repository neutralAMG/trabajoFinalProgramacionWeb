const userFavCommerceModel = require("../Models/UserFavCommerce");
const commerceModel = require("../Models/Commerce");
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");

exports.GetAllUserFavCommerces = async (req,res,next) =>{
    try{
        let userFavCommerce = await userFavCommerceModel.findAll({include:[{model:commerceModel}],where: {UserId: res.locals.UserInfo.Id}});
        userFavCommerce = userFavCommerce.map((c) => c.dataValues.Commerce.dataValues);
       
        
        
        res.render("UserFavCommereceViews/favCommerce-index",{
            userFavCommerce: userFavCommerce,
            isEmpty: userFavCommerce.length === 0,
        } );
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("back");
    }
}

exports.PostAddUserFavCommerces = async (req,res,next) =>{
    try{
        const Id = req.body.Id;

      await  userFavCommerceModel.create({
            UserId: res.locals.UserInfo.Id, 
            CommerceId: Id,
        })
          res.redirect("back");

        }catch (err){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
            console.error(err);
            res.redirect("back");
        }
}

exports.PostDeleteUserFavCommerces = async (req,res,next) =>{
    try{
        const Id = req.body.Id;

        await  userFavCommerceModel.destroy({where:{UserId: res.locals.UserInfo.Id,  CommerceId: Id} });
        res.redirect("back");

        }catch(err){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
            console.error(err);
            res.redirect("back");
        }
}