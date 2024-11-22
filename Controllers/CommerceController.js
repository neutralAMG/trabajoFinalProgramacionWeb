const commereceModel = require("../Models/Commerce");
const commereceTypeModel = require("../Models/CommerceType");
const userModel = require("../Models/User");
const SessionManager = require("../Utils/SessionManager")
exports.GetAllCommerece = async (req,res,next) =>{
    try{
         let commerces = await commereceModel.findAll();
         commerces = commerces.map((c) => c.dataValues);

        res.render("CommereceViews/commerece-mant",{
            commerces: commerces,
            isEmpty: commerces.length === 0,
        } );
    }catch{
        console.error(err);
    }
}
exports.GetAllCommereceByCommerceType = async (req,res,next) =>{
    const cTypeId = req.params.cTypeId
    try{
        let commerces = await commereceModel.findAll({where:{CommerceTypeId:cTypeId}});
        commerces = commerces.map((c) => c.dataValues);

       res.render("CommereceViews/commerece-ctype",{
           commerces: commerces,
           isEmpty: commerces.length === 0,
       } );
   }catch{
       console.error(err);
   }
}

exports.GetAddCommerece = async (req,res,next) =>{
    try{
    const userPendingToSave = {
        Name,
        UserName,
        Email,
        Cedula,
        Phone,
        IsActive,
        IsBusy,
        Password,
        ConfirmPassword,
        RoleId,
        CommerceId 
    } = req.body;
    const commerceTypes = commereceTypeModel.findAll();
    res.render("CommereceViews/commerece-add",{
        commerceTypes: (await commerceTypes).map((c) => c.dataValues),
        userPendingToSave: userPendingToSave,
        EditMode: false,
    })
    
   
  }catch(err){
    console.error(err);
  }
}

exports.PostAddCommerece = async (req,res,next) =>{
    try{
        const userPendingToSave = {
            Name,
            UserName,
            Email,
            Cedula,
            Photo, 
            Phone,
            IsActive,
            IsBusy,
            Password,
            ConfirmPassword,
            RoleId,
            CommerceId 
        } = req.body;

        const 
        {NameC, 
         Phone, 
         Email, 
        IsActive,
        OpeningHour, 
        ClousingHour, 
         CommerceTypeId,
        } = req.body;

        const logo = Logo.file
        await commereceModel.create({
        Name:NameC, 
         Phone, 
         Email, 
         Logo: "/" + logo.path, 
        IsActive,
        OpeningHour, 
        ClousingHour, 
         CommerceTypeId,
        });
         const Photo = req.file


         await userModel.create({
        Name,
        UserName,
        Email,
        Cedula,
        Photo, 
        Phone: "/" +    Photo.path,
        IsActive,
        IsBusy,
        Password,
        RoleId,
        CommerceId: (await commereceModel.findOne({where: {Name: NameC}})).dataValues.Id, 
    });
    res.redirect("")
    }catch (err){
        console.error(err);
    }
}

exports.GetEditCommerece = async (req,res,next) =>{
     const commereceToUpdate =   await commereceModel.findByPk(SessionManager.getSessionUserInfo(res).CommerceId);
     const commerceTypes = commereceTypeModel.findAll();
    res.render("CommereceViews/commerece-add",{
        commerece: commereceToUpdate.dataValues,
        commerceTypes: (await commerceTypes).map((c) => c.dataValues),
        userPendingToSave: null,
        EditMode: true,
    })
}

exports.PostEditCommerece = async (req,res,next) =>{
    const 
    {NameC, 
     Phone, 
     Email, 
    IsActive,
    OpeningHour, 
    ClousingHour, 
     CommerceTypeId,
    } = req.body;


    const logo = Logo.file
    await commereceModel.update({
     Name:NameC, 
     Phone, 
     Email, 
     Logo: "/" + logo.path, 
     IsActive,
     OpeningHour, 
     ClousingHour, 
     CommerceTypeId,
    }, {where:{Id: SessionManager.getSessionUserInfo(res).CommerceId}});

    res.redirect("/commerece/commerece-edit/"+ SessionManager.getSessionUserInfo(res).CommerceId)
}
exports.PostChangeActiveStateCommerece = async (req,res,next) =>{
    const commereceToUpdate = await commereceModel.findByPk(SessionManager.getSessionUserInfo(res).CommerceId);
    await commereceModel.update({
        IsActive: !commereceToUpdate.dataValues.IsActive,
       }, {where:{Id:SessionManager.getSessionUserInfo(res).CommerceId}});

       res.redirect("/user/user-mant/")
}

