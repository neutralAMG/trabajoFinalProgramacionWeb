const userFavCommerceModel = require("../Models/UserFavCommerce");
const commerceModel = require("../Models/Commerce");


exports.GetAllUserFavCommerces = async (req,res,next) =>{
    try{
        let userFavCommerce = await userFavCommerceModel.findAll({include:[{model:commerceModel}],where: {UserId: res.locals.UserInfo.Id}});
        userFavCommerce = userFavCommerce.map((c) => c.dataValues.Commerce.dataValues);
        const currentTime = new Date().toLocaleTimeString("en-US",{hour12: false, hour: "2-digit", minute: "2-digit" } );

        userFavCommerce = userFavCommerce.map((c) => {
            c.IsClose = (c.ClousingHour > currentTime || c.OpeningHour < currentTime);
            return c;
        });

        
        
        res.render("UserFavCommereceViews/favCommerce-index",{
            userFavCommerce: userFavCommerce,
            isEmpty: userFavCommerce.length === 0,
        } );
    }catch (err){
        console.error(err);
    }
}

exports.PostAddUserFavCommerces = async (req,res,next) =>{
    try{
        const Id = req.body.Id;

      await  userFavCommerceModel.create({
            UserId: res.locals.UserInfo.Id, 
            CommerceId: Id,
        })
console.log(commerces);
        res.redirect("back");

        }catch (err){
           res.redirect("back");
           console.error(err);
        }
}

exports.PostDeleteUserFavCommerces = async (req,res,next) =>{
    try{
        const Id = req.body.Id;

        await  userFavCommerceModel.destroy({where:{UserId: res.locals.UserInfo.Id,  CommerceId: Id} });

        res.redirect("back");

        }catch{
           res.redirect("back");
           console.error(err);
        }
}