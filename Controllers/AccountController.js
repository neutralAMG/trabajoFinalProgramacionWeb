const userModel = require("../Models/User");
const roleModel = require("../Models/Role");
const SessionManager = require("../Utils/SessionManager");
const bycrypt = require("bcryptjs");
const {Op} = require("sequelize");
const {Roles} = require("../Utils/ImportantENVVariables");



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
        res.redirect("/account/authenticate");

    if(!UserToAuth.dataValues.IsActive)
        res.redirect("/account/authenticate");


    const IsPasswordValid = await bycrypt.compare(Pass, UserToAuth.dataValues.Password)

    if(!IsPasswordValid) 
        res.redirect("/account/authenticate");

    await SessionManager.Login(req,{
        Id: UserToAuth.dataValues.Id,
        CommerceId: UserToAuth.dataValues.CommerceId,
        Name: UserToAuth.dataValues.Name,
        RoleId: UserToAuth.dataValues.RoleId,
        IsActive: UserToAuth.dataValues.IsActive,
    })
    res.redirect(GetRoleHomeUrl(UserToAuth.dataValues.RoleId))
}
exports.PostUnAuthenticate = async (req,res,next)=>{
    await SessionManager.Logout(req);
    await res.redirect("/account/authenticate");
}

exports.GetRegister = async (req,res,next)=>{
    const roles = await roleModel.findAll();
    res.render("Auth/register",{
        roles: roles
    });
}

exports.PostRegister = async (req,res,next)=>{
    const {
        Name,
        UserName,
        Email,
        Cedula,
        Phone,
        Password,
        ConfirmPassword,
        RoleId,
    } = req.body;

    const Pthoto = req.body.file;

    if(Password != ConfirmPassword)
        res.redirect("/account/authenticate");

    const  hashPass = await bycrypt.hash(Password, 12);
    
    await userModel.create({
        Name,
        UserName,
        Email,
        Cedula: Cedula ?? "",
        Photo: "/"+ Pthoto.path, 
        Phone,
        Password: hashPass,
        RoleId,
    });

    res.redirect("/account/authenticate");
}

exports.PostChangeActiveState = async (req,res,next)=>{
    const id = req.params.id;
    const userToUpdate = await userModel.findByPk(req.locals.UserInfo.CommerceId);

    await userModel.update({
        IsActive: !userToUpdate.dataValues.IsActive,
       }, {where:{Id:id}});
       // using http referrer
       res.redirect("back");
}

const GetRoleHomeUrl = (role) =>{
    let url; 
    if (role === Roles.Admin) {
        url =  "home/home-admin";
    }else if (role === Roles.Delivery) {
        url =  "home/home-delivery";
    }else if (role === Roles.Client) {
        url =  "home/home-client";
    }else{
        //Commerece
        url =  "home/home-commerece";
    }
    return url;
}