const userModel = require("../Models/User");
const SessionManager = require("../Utils/SessionManager");
const bycrypt = require("bcryptjs");
const {Op} = require("sequelize")


exports.GetAuthenticate = async (req,res,next)=>{
    res.render("Auth/login",{})
}
exports.PostAuthenticate = async (req,res,next)=>{
    const {UserNameOrEmail, Pass} = req.body;

    const UserToAuth = await userModel.findOne({
        where:{
           [Op.or]:[
            {UserName: UserNameOrEmail},
            {Email: UserNameOrEmail}
           ]
        }
    })

    if(!UserToAuth)
        res.redirect("/account//authenticate");

    const IsPasswordValid = await bycrypt.compare(Pass, UserToAuth.dataValues.Password)

    if(!IsPasswordValid) 
        res.redirect("/account//authenticate");

    SessionManager.Login(req,{
        Id: UserToAuth.dataValues.Id,
        CommerceId: UserToAuth.dataValues.CommerceId,
        Name: UserToAuth.dataValues.Name,
        RoleId: UserToAuth.dataValues.RoleId,
        IsActive: UserToAuth.dataValues.IsActive,
    })
    res.redirect("/")
}
exports.PostUnAuthenticate = async (req,res,next)=>{
    SessionManager.Logout(req)
    res.redirect()
}

exports.GetRegister = async (req,res,next)=>{
    
}

exports.PostRegister = async (req,res,next)=>{
    const {
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
    } = req.body

        if(Password != ConfirmPassword)
            res.redirect("/account/authenticate");
        const  hashPass = await bycrypt.hash(pass, 12);

}

exports.PostChangeActiveState = async (req,res,next)=>{
    const id = req.params.id;
    const userToUpdate = await userModel.findByPk(req.locals.UserInfo.CommerceId);

    await userModel.update({
        IsActive: !userToUpdate.dataValues.IsActive,
       }, {where:{Id:id}});

       res.redirect("/user/user-mant/")
}