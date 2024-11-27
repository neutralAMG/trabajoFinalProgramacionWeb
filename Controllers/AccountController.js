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
            if( (UserToAuth.dataValues.RoleId === Roles.Employee || UserToAuth.dataValues.RoleId === Roles.Manager )&& UserToAuth.dataValues.CommerceId){
                req.flash(ErrorNameforFlash, "Commerece is not active, contact an admin");
                 return  res.redirect("/account/authenticate");
            }
            req.flash(ErrorNameforFlash, "User is not active");
            return  res.redirect("/account/authenticate");
        }

        req.session.UserInfo = UserToAuth.dataValues;
        req.session.IsLogin = true;
        
        req.session.save((err) => {
            if (err) {
                req.flash(ErrorNameforFlash, "Error saving session");
                return res.redirect("/account/authenticate");
            }

            // Redirect to home page based on the user's role
            return res.redirect(GetRoleHomeUrl(UserToAuth.dataValues.RoleId));
        });
       
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/authenticate");
    }
}
exports.PostUnAuthenticate =  (req,res,next)=>{
     req.session.destroy((err) => {
        console.log(err);
        
     });
     res.redirect("/account/authenticate");
}

exports.GetRegister = async (req,res,next)=>{
    let roles = await roleModel.findAll();
    roles = roles.map((r) => r.dataValues);
    res.render("Auth/register",{
        roles: roles.filter((r) => r.Id != Roles.Admin && r.Id != Roles.Employee)
    });
}

exports.PostRegister = async (req,res,next)=>{
    try{
        const {
            Name,
            LastName,
            UserName,
            Email,
            Cedula,
            Phone,
            Password,
            ConfirmPassword,
            RoleId,
        } = req.body;
    
        const Photo = req.file;

        let userWithSameCredentials  = await userModel.findOne({ where:{Email: Email}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the email, "+ Email);
          return  res.redirect("/account/register");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the username, "+ UserName);
            return res.redirect("/account/register");
        }

        if(Password != ConfirmPassword){
            req.flash(ErrorNameforFlash, "passwords dont match");
            return  res.redirect("/account/register");
        }
            
       const  hashPass = await bycrypt.hash(Password, 12);
        
       const newUser = await userModel.create({
            Name,
            LastName,
            UserName,
            Email,
            Cedula: Cedula ?? "",
            Photo: "/"+ Photo.path, 
            Phone,
            Password: hashPass,
            RoleId,
        });
        console.log(newUser);
        
         transporter.sendMail({
            from: "alejandrodanielmoscosoguerrero@gmail.com",
            to: newUser.dataValues.Email,
            subject: "Activate your account",
            html: `<h1><a href='http://localhost:8001/account/activate-user/${newUser.Id}'>  Click this link to activate your account</a></h1>`
        }, (err) =>{console.error("Error during registration:", err.toString().split(" at ")[0]); });
    
        res.redirect("/account/register");
    }catch (err){
        console.error("Error during registration:", err.toString().split(" at ")[0]);
        req.flash(ErrorNameforFlash, "An unexpected error happed");
        res.redirect("/account/register");
    }
}

exports.PostChangeActiveState = async (req,res,next)=>{
    const Id = req.body.Id;

    try {
        if(Id != res.locals.UserInfo.Id){
             const userToUpdate = await User.findByPk(Id);
             await userModel.update({
              IsActive: userToUpdate.dataValues.IsActive === true ? false :  true,
            }, {where:{Id:Id}});
             // using http referrer
       
             return res.redirect("back");

        }
             return res.redirect("back");
   
  
    } catch (err) {
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
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
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("/account/reset-password");
    }

}  
exports.GetNewPassword = async (req,res,next)=>{
    try {
        const token = req.params.token;
       const user = await User.findOne({where:{ResetToken: token, ResetTokenExpiration: {
            [Op.gte]: Date.now(),
        }}});

        if(!user){
            req.flash(ErrorNameforFlash, "invalid token");
          return res.redirect("/account/reset-password");  
        }
        res.render("Auth/new-password",{
            userId: user.dataValues.Id,
            token:user.dataValues.ResetToken
        })
    } catch (err) {
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("/account/reset-password");
    }
}

exports.PostNewPassword  = async (req,res,next)=>{
    try{
        const {newPass, confirmPass, userId, passToken} = req.body;

       if(newPass != confirmPass){
        req.flash(ErrorNameforFlash, "password dont match");
         return res.redirect("/account/reset-password");
       }
       const user = await User.findOne({where:{Id: userId,ResetToken: passToken, ResetTokenExpiration: {
        [Op.gte]: Date.now(),
       }}});

       if(!user){
       req.flash(ErrorNameforFlash, "invalid token");
       return res.redirect("/account/reset-password");
       } 

       const newHashPass = await bycrypt.hash(newPass, 12);

       await user.update({
         Password: newHashPass,
        ResetToken: null,
        ResetTokenExpiration: null,
       }, {where:{Id:userId}});

       res.redirect("/account/authenticate");

    }catch(err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("/account/reset-password");
    }

}  

exports.PostActivateUser  = async (req,res,next)=>{
    try{
        const Id = req.params.Id;

       if(newPass != confirmPass){
        req.flash(ErrorNameforFlash, "password dont match");
        return res.redirect("/account/reset-password");
       }
       const user = await User.findOne({where:{Id: Id}});

       if(!user){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        return res.redirect("/account/reset-password");
       }
       
        await user.update({
            IsActive: true
          }, {where:{Id:Id}});

       res.redirect("/account/authenticate")
    }catch(err){
        req.flash(ErrorNameforFlash, "An unexpected errror happed");
        res.redirect("/account/reset-password");
    }

}  