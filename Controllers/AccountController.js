const userModel = require("../Models/User");
const roleModel = require("../Models/Role");
const SessionManager = require("../Utils/SessionManager");
const bycrypt = require("bcryptjs");
const {Op} = require("sequelize");
const {Roles,UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");
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
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Email or username is invalid");
           return res.redirect("/account/authenticate");
        }

        const IsPasswordValid = await bycrypt.compare(Pass, UserToAuth.dataValues.Password)
    
        if(!IsPasswordValid) {
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "The password is incorrect");
            return res.redirect("/account/authenticate");
        }
        
        if(!UserToAuth.dataValues.IsActive){
            if( (UserToAuth.dataValues.RoleId === Roles.Employee || UserToAuth.dataValues.RoleId === Roles.Manager )&& UserToAuth.dataValues.CommerceId){
                req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Commerece is not active, contact an admin");
                 return  res.redirect("/account/authenticate");
            }
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "User is not active");
            return  res.redirect("/account/authenticate");
        }

        req.session.UserInfo = UserToAuth.dataValues;
        req.session.IsLogin = true;
        
        req.session.save((err) => {
            if (err) {
                req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error saving session");
                return res.redirect("/account/authenticate");
            }

            // Redirect to home page based on the user's role
            req.flash(UIMessagesNamesForFlash.SuccessMessageName, "Login was successfull");
            return res.redirect(GetRoleHomeUrl(UserToAuth.dataValues.RoleId));
        });
       
    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected errror happed");
        res.redirect("/account/authenticate");
        console.error(err);
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
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the email, "+ Email);
          return  res.redirect("/account/register");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the username, "+ UserName);
            return res.redirect("/account/register");
        }

        if(Password != ConfirmPassword){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "passwords dont match");
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

         transporter.sendMail({
            from: "alejandrodanielmoscosoguerrero@gmail.com",
            to: newUser.dataValues.Email,
            subject: "Activate your account",
            html: `  <h1>Activate Your Account</h1>
            <p>Click the button below to activate your account:</p>
            <a href="http://localhost:8001/account/activate-user/${newUser.Id}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
                ACTIVATE
            </a>
            `
        }, (err) =>{console.error("Error during registration:", err.toString().split(" at ")[0]); });

        req.flash(UIMessagesNamesForFlash.SuccessMessageName, "User was registered successfully");
        res.redirect("/account/authenticate");
    }catch (err){
        console.error("Error during registration:", err.toString().split(" at ")[0]);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
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
        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "User was registered successfully");
        return res.redirect("back");
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.PostChangeEmployeeRole = async (req,res,next)=>{
    const Id = req.body.Id;
    const RoleId = req.body.RoleId;

    try {
        const userToUpdate = await User.findByPk(Id);
        if(Id != res.locals.UserInfo.Id && userToUpdate.dataValues.CommerceId === res.locals.UserInfo.CommerceId){
             
             await userModel.update({
              RoleId: RoleId,
            }, {where:{Id:Id}});
             // using http referrer
             req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "User has been changed");
             return res.redirect("back");

        }
        req.flash(UIMessagesNamesForFlash.InfoMessageName,  "User cant change it self");
        return res.redirect("back");
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}
//TODO: abstract this
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
        const Email = req.body.Email;
;

        crypto.randomBytes(32, async (err, buffer) =>{
            if(err){
                console.error(err);
                req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected errror happed");
                return res.render("/account/reset-password");
            };
            const token = buffer.toString("hex");

           const user =  await User.findOne({where:{Email: Email}});

           if(!user){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is no user with that email");
            return res.render("/account/reset-password");
           }


            
           await User.update(
            {ResetToken: token,
                ResetTokenExpiration: Date.now() + 3000000
            },{where:{Id: user.dataValues.Id}}
           )
          await transporter.sendMail({
            from: "alejandrodanielmoscosoguerrero@gmail.com",
            to: user.dataValues.Email,
            subject: "change password",
            html: `<h1><a href='http://localhost:8001/account/reset-password/${token}'>  Click this link to reset your password </a></h1>`
           });
           req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The email to reset your password has been sent");
           res.redirect("/account/authenticate");
        })
        
       
    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
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
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "invalid token");
          return res.redirect("/account/reset-password");  
        }
        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Create your new password");
        res.render("Auth/new-password",{
            userId: user.dataValues.Id,
            token:user.dataValues.ResetToken
        })
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("/account/reset-password");
    }
}

exports.PostNewPassword  = async (req,res,next)=>{
    try{
        const {newPass, confirmPass, userId, passToken} = req.body;

       if(newPass != confirmPass){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "password dont match");
         return res.redirect("/account/reset-password/" + passToken);
       }
       const user = await User.findOne({where:{Id: userId,ResetToken: passToken, ResetTokenExpiration: {
        [Op.gte]: Date.now(),
       }}});

       if(!user){
       req.flash(UIMessagesNamesForFlash.ErrorMessageName, "invalid token");
       return res.redirect("/account/reset-password");
       }  

       const newHashPass = await bycrypt.hash(newPass, 12);

       await User.update({
         Password: newHashPass,
        ResetToken: null,
        ResetTokenExpiration: null,
       }, {where:{Id:userId}});
       req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Your new password has been set");
       res.redirect("/account/authenticate");

    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("/account/new-password");
    }

}  


exports.GetActivateUser  = async (req,res,next)=>{
    try{
        const Id = req.params.id;

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Activate your account now");
        res.render("Auth/activate",{
            Id: Id
        });

    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected errror happed");
        res.redirect("/account/authenticate");
    }

}  

exports.PostActivateUser  = async (req,res,next)=>{
    try{
        const Id = req.body.Id;


       const user = await User.findOne({where:{Id: Id}});

       if(!user){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected errror happed");
        return res.redirect(/*"/account/reset-password"*/ "back");
       }
       
        await user.update({
            IsActive: true
          }, {where:{Id:Id}});

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "Your account has been activated");
       res.redirect("/account/authenticate");

    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected errror happed");
        res.redirect("/account/reset-password");
    }

}  