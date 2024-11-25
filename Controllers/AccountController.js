const userModel = require("../Models/User");
const roleModel = require("../Models/Role");
const SessionManager = require("../Utils/SessionManager");
const bycrypt = require("bcryptjs");
const {Op, where} = require("sequelize");
const {Roles,ErrorNameforFlash} = require("../Utils/ImportantENVVariables");
const crypto = require("crypto");
const User = require("../Models/User");
const transporter = require("../Services/EmailService")

exports.GetAuthenticate = async (req,res,next)=>{
    res.render("Auth/login",{})
}
exports.PostAuthenticate = async (req,res,next)=>{
    try{
        const {UserNameOrEmail, Pass} = req.body;

        const UserToAuth = await userModel.findOne({
            where:{
               [Op.or]:[
                {UserName: UserNameOrEmail},
                {Email: UserNameOrEmail}
               ]
            }
        })
    
        if(!UserToAuth){
            req.flash(ErrorNameforFlash, "Email or username is invalid");
           return res.redirect("/account/authenticate");
        }

        const IsPasswordValid = await bycrypt.compare(Pass, UserToAuth.dataValues.Password)
    
        if(!IsPasswordValid) {
            req.flash(ErrorNameforFlash, "The password is incorrect");
            return res.redirect("/account/authenticate");
        }
        
        if(!UserToAuth.dataValues.IsActive){
            req.flash(ErrorNameforFlash, "User is not active");
            return  res.redirect("/account/authenticate");
        }
    
        await SessionManager.Login(req,{
            Id: UserToAuth.dataValues.Id,
            CommerceId: UserToAuth.dataValues.CommerceId,
            Name: UserToAuth.dataValues.Name,
            RoleId: UserToAuth.dataValues.RoleId,
            IsActive: UserToAuth.dataValues.IsActive,
        });
        
        res.redirect(GetRoleHomeUrl(UserToAuth.dataValues.RoleId));
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/authenticate");
    }
}
exports.PostUnAuthenticate = async (req,res,next)=>{
    await SessionManager.Logout(req);
    await res.redirect("/account/authenticate");
}

exports.GetRegister = async (req,res,next)=>{
    let roles = await roleModel.findAll();
    roles = roles.map((r) => r.dataValues);
    res.render("Auth/register",{
        roles: roles.filter((r) => r.Id != Roles.Admin || r.Id != Roles.Employee)
    });
}

exports.PostRegister = async (req,res,next)=>{
    try{
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

        let userWithSameCredentials  = await userModel.findOne({ where:{Email: Email}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the email, "+ Email);
            res.redirect("/account/authenticate");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the username, "+ UserName);
            res.redirect("/account/authenticate");
        }

        if(Password != ConfirmPassword){
            req.flash(ErrorNameforFlash, "passwords dont match");
            res.redirect("/account/authenticate");
        }
            
        const  hashPass = await bycrypt.hash(Password, 12);
        
       const newUser = await userModel.create({
            Name,
            UserName,
            Email,
            Cedula: Cedula ?? "",
            Photo: "/"+ Pthoto.path, 
            Phone,
            Password: hashPass,
            RoleId,
        });

        transporter.sendMail({
            from: "alejandrodanielmoscosoguerrero@gmail.com",
            to: newUser.dataValues.Email,
            subject: "Activate your account",
            html: `<h1><a href='http://localhost:8001/account/activate-user/${newUser.Id}'>  Click this link to activate your account</a></h1>`
        })
    
        res.redirect("/account/authenticate");
    }catch (err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/authenticate");
    }
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
        url =  "/home/home-admin";
    }else if (role === Roles.Delivery) {
        url =  "/home/home-delivery";
    }else if (role === Roles.Client) {
        url =  "/home/home-client";
    }else{
        //Commerece
        url =  "/home/home-commerece";
    }
    return url;
}

exports.GetReset = async (req,res,next)=>{
    res.render("Auth/reset",{})
}
exports.PostReset = async (req,res,next)=>{
    try{
        const email = req.body.email;

        crypto.randomBytes(32, async (err, buffer) =>{
            if(err){
                console.error(err);
                req.flash(ErrorNameforFlash, "An unexpected errror happed");
                return res.render("/account/reset-password");
            };
            const token = buffer.toString("hex");

           const user =  await User.findOne({where:{Email: email}});

           if(!user){
            req.flash(ErrorNameforFlash, "There is no user with that email");
            return res.render("/account/reset-password");
           }

           user.ResetToken = token;
           user.ResetTokenExpiration = Date.now() + 3000000;
            
          await transporter.sendMail({
            from: "alejandrodanielmoscosoguerrero@gmail.com",
            to: user.Email,
            subject: "change password",
            html: `<h1><a href='http://localhost:8001/account/reset/${token}'>  Click this link to reset your password </a></h1>`
           });
           res.render("/account/authenticate");
        })
        
       
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/reset-password");
    }

}  
exports.GetNewPassword = async (req,res,next)=>{
        const token = req.params.token;
       const user = await User.findOne({where:{ResetToken: token, ResetTokenExpiration: {
            [Op.gte]: Date.now(),
        }}})

        if(!user){
            req.flash(ErrorNameforFlash, "invalid token");
            res.redirect("/account/reset-password");
        }
        res.render("Auth/new-password",{
            userId: user.dataValues.Id,
            token:user.dataValues.ResetToken
        })
}

exports.PostNewPassword  = async (req,res,next)=>{
    try{
        const {newPass, confirmPass, userId, passToken} = req.body;

       if(newPass != confirmPass){
        req.flash(ErrorNameforFlash, "password dont match");
        res.redirect("/account/reset-password");
       }
       const user = await User.findOne({where:{Id: userId,ResetToken: passToken, ResetTokenExpiration: {
        [Op.gte]: Date.now(),
       }}});

       if(!user){
        req.flash(ErrorNameforFlash, "invalid token");
        res.redirect("/account/reset-password");

       const newHashPass = await bycrypt.hash(newPass, 12);
      

       await user.update({
         Password: newHashPass,
        ResetToken: null,
        ResetTokenExpiration: null,
       }, {where:{Id:userId}});
       res.redirect("/account/authenticate")
    }
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/reset-password");
    }

}  

exports.PostActivateUser  = async (req,res,next)=>{
    try{
        const Id = req.params.Id;

       if(newPass != confirmPass){
        req.flash(ErrorNameforFlash, "password dont match");
        res.redirect("/account/reset-password");
       }
       const user = await User.findOne({where:{Id: Id}});

       if(!user){
        req.flash(ErrorNameforFlash, "invalid  request");
        res.redirect("/account/reset-password");
       
        await user.update({
            IsActive: true
          }, {where:{Id:Id}});

       res.redirect("/account/authenticate")
    }
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/reset-password");
    }

}  