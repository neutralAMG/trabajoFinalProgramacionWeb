const userFavCommerceModel = require("../Models/UserFavCommerce");
const commerceModel = require("../Models/Commerce");
const SessionManager = require("../Utils/SessionManager");


exports.GetAllUserFavCommerces = async (req,res,next) =>{
    try{
        let userFavCommerce = await userFavCommerceModel.findAll({include:[{model:commerceModel}],where: {UserId: SessionManager.getSessionUserInfo(res).Id}});
        userFavCommerce = userFavCommerce.map((c) => c.dataValues);

        res.render("UserFavCommereceViews/favCommerce-index",{
            userFavCommerce: userFavCommerce,
            isEmpty: userFavCommerce.length === 0,
        } );
    }catch{
        console.error(err);
    }
}

exports.PostAddUserFavCommerces = async (req,res,next) =>{
    try{
        const id = req.params.id;

      await  userFavCommerceModel.create({
            UserId: SessionManager.getSessionUserInfo(res).Id, 
            CommerceId: id,
        })

        res.redirect("/commerece/commerece-Index");

        }catch{
           res.redirect("/commerece/commerece-Index");
           console.error(err);
        }
}

exports.PostDeleteUserFavCommerces = async (req,res,next) =>{
    try{
        const id = req.params.id;

        await  userFavCommerceModel.destroy({where:{UserId: SessionManager.getSessionUserInfo(res).Id,  CommerceId: id} });

        res.redirect("/favCommerce/favCommerce-Index");

        }catch{
           res.redirect("/favCommerce/favCommerce-Index");
           console.error(err);
        }
}