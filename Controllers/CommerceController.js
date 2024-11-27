const commereceModel = require("../Models/Commerce");
const commereceTypeModel = require("../Models/CommerceType");
const userModel = require("../Models/User");
const SessionManager = require("../Utils/SessionManager");
const User = require("../Models/User");
const { Op } = require("sequelize");
const {ErrorNameforFlash} = require("../Utils/ImportantENVVariables");

exports.GetAllCommerece = async (req,res,next) =>{
    try{
         let commerces = await commereceModel.findAll({include:[{model:commereceTypeModel}, {model:User}]});
         commerces = commerces.map((c) => c.dataValues);
         commerces = commerces.map((c) =>{
            c.amountOrders = c.dataValues.CommereceTypes;
            c.amountEmployees = c.dataValues.Users;
            return c;
         })
         //TODO: format opening and clousing times
        res.render("CommereceViews/commerece-mant",{
            commerces: commerces,
            isEmpty: commerces.length === 0,
        });
    }catch{
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}
exports.GetAllCommereceByCommerceType = async (req,res,next) =>{
    const cTypeId = req.params.cTypeId
    try{
        let commerces = await commereceModel.findAll({
            where:{CommerceTypeId:cTypeId, 
            ClousingHour:{[Op.gt]:[new Date().getTime]}, 
            OpeningHour:{[Op.lt]:[new Date().getTime]},
            IsActive: true,
        }});
        commerces = commerces.map((c) => c.dataValues);

       res.render("CommereceViews/commerece-ctype",{
           commerces: commerces,
           isEmpty: commerces.length === 0,
       } );
   }catch{
    req.flash(ErrorNameforFlash, "Error while processing the request");
    console.error(err);
    res.redirect("/commerceType/commerceType-Index");
   }
}

exports.GetAddCommerece = async (req,res,next) =>{
    try{
        const commerceTypes = commereceTypeModel.findAll();
        res.render("CommereceViews/commerece-add",{
            commerceTypes: (await commerceTypes).map((c) => c.dataValues),
            EditMode: false,
        })

      }catch(err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
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

        const logo = Logo.file
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
            CommerceId: newCommerece.Id, 
        },{where:{Id: req.user.Id}});
        
        const UserInfo = req.user;
        UserInfo.CommerceId = newCommerece.Id;

        await SessionManager.Logout(res);
        await SessionManager.Login(req, UserInfo);

       res.status(201).redirect("/home/home-commerece");
    }catch (err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.GetEditCommerece = async (req,res,next) =>{
    try {
     const commereceToUpdate =   await commereceModel.findByPk(req.user.CommerceId);
     const commerceTypes = commereceTypeModel.findAll();
      res.render("CommereceViews/commerece-add",{
        commerece: commereceToUpdate.dataValues,
        commerceTypes: (await commerceTypes).map((c) => c.dataValues),
        userPendingToSave: null,
        EditMode: true,
       })
    } catch (error) {
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }

}
    

exports.PostEditCommerece = async (req,res,next) =>{
    try {
        const 
    {NameC, 
     Phone, 
     Email, 
    IsActive,
    OpeningHour, 
    ClousingHour, 
     CommerceTypeId,
    } = req.body;


    const logo = req.file
    await commereceModel.update({
     Name:NameC, 
     Phone, 
     Email, 
     Logo: "/" + logo.path, 
     IsActive,
     OpeningHour, 
     ClousingHour, 
     CommerceTypeId,
    }, {where:{Id: req.user.CommerceId}});

    res.redirect("/commerece/commerece-edit/"+ req.user.CommerceId);
    } catch (error) {
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}
exports.PostChangeActiveStateCommerece = async (req,res,next) =>{
     const Id = req.body.Id;
    try{
        const commereceToUpdate = await commereceModel.findByPk(Id);
       
        const status = commereceToUpdate.dataValues.IsActive ? false : true;

        const Users = await User.findAll({where:{CommerceId: Id}});
        if(Users){
            Users.forEach( async (user) =>{
           await User.update({
                IsActive: status
            },{where:{Id: user.dataValues.Id}});
        });
        }
         

        await commereceModel.update({
           IsActive: status,
        }, {where:{Id:req.user.CommerceId}});

       res.redirect("back")

    }catch(err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

