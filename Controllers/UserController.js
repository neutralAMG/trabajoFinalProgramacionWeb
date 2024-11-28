const userModel = require("../Models/User");
const orderModel = require("../Models/Order");
const {Roles,ErrorNameforFlash} = require("../Utils/ImportantENVVariables");
const bycrypt = require("bcryptjs");


exports.GetAllUserClientMant = async (req,res,next) =>{
    try{
        let clients = await userModel.findAll({ include:[{model:orderModel}],where:{ RoleId:Roles.Client}});
        clients = clients.map((p) => p.dataValues);
        console.log(clients);

        res.render("UserViews/user-client",{
            clients: clients.map((p) => {
                p.amountOrder = p.Orders.length;
                return p;
               }),
            isEmpty: clients.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(ErrorNameforFlash, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }
}

exports.GetAllUserDeliveryMant = async (req,res,next) =>{
    try{
        let deliveries = await userModel.findAll({ include:[{model:orderModel}],where:{ RoleId:Roles.Delivery}});
        deliveries = deliveries.map((p) => p.dataValues);

        res.render("UserViews/user-delivery",{
            deliveries: deliveries.map((p) => {
                p.amountOrder = p.Orders.length;
                return p;
               }),
            isEmpty: deliveries.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(ErrorNameforFlash, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }

}

exports.GetAllAdminUserMant = async (req,res,next) =>{
    try{
        let admins = await userModel.findAll({where:{ RoleId:Roles.Admin}});
        admins = admins.map((p) => p.dataValues);

        res.render("UserViews/user-admin",{
            admins: admins,
            isEmpty: admins.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(ErrorNameforFlash, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }

}

exports.GetAllEmployeeUserMant = async (req,res,next) =>{
    try{
        let employees = await userModel.findAll({where:{ RoleId: {[Op.or]:[Roles.Employee, Roles.Manager]}, CommerceId: res.locals.UserInfo.CommerceId}});
        employees = employees.map((p) => p.dataValues);

        res.render("UserViews/user-employee",{
            employees: employees,
            isEmpty: employees.length === 0,
        } );
    }catch{
        console.error(err);
    }

}

exports.GetAddAdmin = async (req,res,next)=> res.render("UserViews/user-add-admin",{ });


exports.PostAddAdmin = async (req,res,next)=>{
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
        } = req.body;
    


        let userWithSameCredentials  = await userModel.findOne({ where:{Email: Email}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the email, "+ Email);
          return  res.redirect("/user/user-admin-add");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(ErrorNameforFlash, "There is allready a user with the username, "+ UserName);
            return res.redirect("/user/user-admin-add");
        }

        if(Password != ConfirmPassword){
            req.flash(ErrorNameforFlash, "passwords dont match");
            return  res.redirect("/user/user-admin-add");
        }
            
       const  hashPass = await bycrypt.hash(Password, 12);
        
     await userModel.create({
            Name,
            LastName,
            UserName,
            Email,
            Cedula: Cedula ?? "",
            Photo: "",
            Phone,
            Password: hashPass,
            RoleId: Roles.Admin,
        });
    
        res.redirect("/user/user-admin-mant");
    }catch (err){
        console.error("Error during registration:", err.toString().split(" at ")[0]);
        req.flash(ErrorNameforFlash, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }
}

exports.GetEditUser = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let user = await userModel.findOne({where: {Id:id ?? req.user.Id}});
    
        res.render("UserViews/user-edit",{
            user: user.dataValues,
            EditMode: true,
        });

        }catch{
           res.redirect(back);
           console.error(err);
        }
}


exports.PostEditUser = async (req,res,next) =>{
    const {Id,   
        Name,
        UserName,
        Email,
        Cedula,
        Password,
        ConfirmPassword,
        RoleId,
        CommerceId  } = req.body;
      let  Photo = req.file;

    try{

        //TODO: test the validations
        const userToUpdate = await userModel.findByPk(Id);
        let userWithSameCredentials;

        if (userToUpdate.dataValues.Email != Email) {
            let userWithSameCredentials  = await userModel.findOne({ where:{Email: Email}});

          if(userWithSameCredentials){
              req.flash(ErrorNameforFlash, "There is allready a user with the email, "+ Email);
           return  res.redirect("/user/user-admin-add");
          }

        }
        if (userToUpdate.dataValues.Email != Email) {
            userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

           if(userWithSameCredentials){
              req.flash(ErrorNameforFlash, "There is allready a user with the username, "+ UserName);
              return res.redirect("/user/user-admin-add");
             }
        } 

        if(Password != ConfirmPassword){
            req.flash(ErrorNameforFlash, "passwords dont match");
            return  res.redirect("/user/user-admin-add");
        }
            
        if(Password != ConfirmPassword)
            return res.redirect("/user/user-edit/" + Id);

     await userModel.update({
        Name,
        UserName,
        Email,
        Cedula,
        Photo: "/"+Photo.path,
        Phone ,
        IsActive,
        IsBusy,
        Password,
        RoleId,
        CommerceId 
     },{where: {Id:Id}})

     res.redirect("back")

   }catch(err){
     res.redirect("/user/user-edit/" + Id)
     console.error(err);
   }
}
exports.GetEditAdmin = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let user = await userModel.findOne({where: {Id:id}});
    
        res.render("UserViews/user-add-admin",{
            admin: user.dataValues,
            EditMode: true,
        });

        }catch{
           res.redirect(back);
           console.error(err);
        }
}
exports.PostEditUserAdmin = async (req,res,next) =>{
    const {Id,   
        Name,
        LastName,
        UserName,
        Email,
        Cedula,
        Password,
        PrevPassword,
        ConfirmPassword,} = req.body;


    try{
        let newPass = PrevPassword;
        if(Password){
            if(Password != ConfirmPassword){
                return res.redirect("/user/user-admin-edit/" + Id);
            }
            newPass = await bycrypt.hash(Password, 12)  
        } 
        

     await userModel.update({
        Name,
        LastName,
        UserName,
        Email,
        Cedula,
        Password: newPass,
       },{where: {Id:Id}
      });
 
     res.redirect("/user/user-admin-mant")

   }catch(err){
     res.redirect("/user/user-admin-edit/" + Id)
     console.error(err);
   }
}

exports.PostDeleteUser = async (req,res,next) =>{
    const Id = req.body.Id;

   
    

    try{
       if(Id === res.locals.UserInfo.Id){
         await userModel.destroy({where: {Id:Id}});
            // make diferent by role
          return res.redirect(back);
       }
     return res.redirect("back")
    }catch (err){
        res.redirect("/user/user-mant");
        console.error(err);
    }
}

