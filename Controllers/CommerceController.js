const commereceModel = require("../Models/Commerce");
const commereceTypeModel = require("../Models/CommerceType");
const userModel = require("../Models/User");
const orderModel = require("../Models/Order");
const userFave = require("../Models/UserFavCommerce")
const User = require("../Models/User");
const { Op } = require("sequelize");
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");

exports.GetAllCommerece = async (req,res,next) =>{
    try{
         let commerces = await commereceModel.findAll({include:[{model:commereceTypeModel} , {model: orderModel}, {model:User}]});
         commerces = commerces.map((c) => c.dataValues);
         commerces = commerces.map((c) =>{
            c.amountOrders = c.Orders.length;
            c.amountEmployees = c.Users.length;
            return c;
         })
        res.render("CommerceViews/commerce-mant",{
            commerces: commerces,
            isEmpty: commerces.length === 0,
        });
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}
exports.GetAllCommereceByCommerceType = async (req,res,next) =>{
    const cTypeId = req.params.cTypeId
    try{
        let commerces = await commereceModel.findAll({ 
            include:[{model:userFave}],
            where:{CommerceTypeId:cTypeId, 
            IsActive: true,
        }});
        commerces = commerces.map((c) => c.dataValues);
        const currentTime = new Date().toLocaleTimeString("en-US",{hour12: false, hour: "2-digit", minute: "2-digit" } );

        commerces = commerces.map((c) => {
            c.IsFav = c.UserFavCommerces.length != 0;
            c.IsClose =  false/*(c.ClousingHour < currentTime || c.OpeningHour > currentTime)*/;
            return c;
        });

       res.render("CommerceViews/commerece-ctype",{
           commerces: commerces,
           isEmpty: commerces.length === 0,
       } );

   }catch (err){
    req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
    console.error(err);
    res.redirect("/commerceType/commerceType-Index");
   }
}

exports.GetAddCommerece = async (req,res,next) =>{
    try{
        const commerceTypes = await commereceTypeModel.findAll();
        res.render("CommerceViews/commerce-add",{
            commerceTypes: commerceTypes.map((c) => c.dataValues),
            EditMode: false,
        })

      }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
      }
}

exports.PostAddCommerece = async (req,res,next) =>{
    try{
        const 
        {Name, 
         Phone, 
         Email, 
         OpeningHour, 
         ClousingHour, 
         CommerceTypeId,
        } = req.body;

        const logo = req.file
       const newCommerece =  await commereceModel.create({
         Name, 
         Phone, 
         Email, 
         Logo: "/" + logo.path, 
         IsActive: true,
         OpeningHour, 
         ClousingHour, 
         CommerceTypeId,
        });

        await userModel.update({
            CommerceId: newCommerece.dataValues.Id, 
        },{where:{Id: res.locals.UserInfo.Id}});
        
        const UserInfo = res.locals.UserInfo;
        UserInfo.CommerceId = newCommerece.dataValues.Id;

        req.session.UserInfo = UserInfo;
        req.session.IsLogin = true;
        
        req.session.save((err) => {
            if (err) {
                req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error saving session");
                return res.redirect("/account/authenticate");
            }})

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Your Commerece has been created succesfully");
       res.status(201).redirect("/home/home-commerece");
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.GetEditCommerece = async (req,res,next) =>{
    try {
     const commereceToUpdate =   await commereceModel.findByPk(res.locals.UserInfo.CommerceId);
     const commerceTypes = commereceTypeModel.findAll();
      res.render("CommerceViews/commerce-add",{
        commerece: commereceToUpdate.dataValues,
        commerceTypes: (await commerceTypes).map((c) => c.dataValues),
        userPendingToSave: null,
        EditMode: true,
       })
    } catch (error) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }

}
    

exports.PostEditCommerece = async (req,res,next) =>{
    try {
        const 
    {
     Phone, 
     Email, 
     PrevLogo,
    OpeningHour, 
    ClousingHour, 
    } = req.body;


    const logo = req.file
    await commereceModel.update({
     Phone, 
     Email, 
     Logo: logo != null ? "/" + logo.path : PrevLogo, 
     OpeningHour, 
     ClousingHour, 
    }, {where:{Id: res.locals.UserInfo.CommerceId}});

    req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Your commerce info has been updated succesfully");
    res.redirect("/commerece/commerce-edit/"+res.locals.UserInfo.CommerceId);
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}
exports.PostChangeActiveStateCommerece = async (req,res,next) =>{
     const CommerceId = req.body.CommerceId;
    try{
        const commereceToUpdate = await commereceModel.findByPk(CommerceId);
       
        const status = commereceToUpdate.dataValues.IsActive ? false : true;

        const Users = await User.findAll({where:{CommerceId: CommerceId}});
        if(Users){
            Users.forEach( async (user) =>{
           await User.update({
                IsActive: status
            },{where:{Id: user.dataValues.Id}});
        });
        }
         

        await commereceModel.update({
           IsActive: status,
        }, {where:{Id:CommerceId}});

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The commerce and all of its employees have been " + (status ? "activated" : "deactivated"));
       res.redirect("back")

    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

