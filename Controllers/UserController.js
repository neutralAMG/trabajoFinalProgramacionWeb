const userModel = require("../Models/User");
const roleModel = require("../Models/Role");
const orderModel = require("../Models/Order");
const {Roles,UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");
const {Op} = require("sequelize")
const bycrypt = require("bcryptjs");


exports.GetAllUserClientMant = async (req,res,next) =>{
    try{
        let clients = await userModel.findAll({ include:[{model:orderModel, as:"ClientOrders"}],where:{ RoleId:Roles.Client}});
        clients = clients.map((p) => p.dataValues);
        console.log(clients);

        res.render("UserViews/user-client",{
            clients: clients.map((p) => {
                p.amountOrder = p.ClientOrders.length;
                return p;
               }),
            isEmpty: clients.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }
}

exports.GetAllUserDeliveryMant = async (req,res,next) =>{
    try{
        let deliveries = await userModel.findAll({ include:[{model:orderModel, as:"DeliveryOrders"}],where:{ RoleId:Roles.Delivery}});
        deliveries = deliveries.map((p) => p.dataValues);

        res.render("UserViews/user-delivery",{
            deliveries: deliveries.map((p) => {
                p.amountOrder = p.DeliveryOrders.length;
                return p;
               }),
            isEmpty: deliveries.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
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
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }

}

exports.GetAllEmployeeUserMant = async (req,res,next) =>{
    try{
        let employees = await userModel.findAll({include: [{model:roleModel }],where:{ [Op.or]:[{RoleId: Roles.Employee},{ RoleId: Roles.Manager}], CommerceId: res.locals.UserInfo.CommerceId}});
        employees = employees.map((p) => p.dataValues);

        res.render("UserViews/user-employee",{
            employees: employees,
            isEmpty: employees.length === 0,
        } );
    }catch (err){
        console.error(err);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        res.redirect("/home/home-commerece");
    }

}

exports.GetAddAdmin = async (req,res,next)=> res.render("UserViews/user-add-admin",{
    EditMode: false, 
});


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
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the email, "+ Email);
          return  res.redirect("/user/user-admin-add");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the username, "+ UserName);
            return res.redirect("/user/user-admin-add");
        }

        if(Password != ConfirmPassword){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "passwords dont match");
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
        req.flash(UIMessagesNamesForFlash.SuccessMessageName, "The admin has been created successfully"); 
        res.redirect("/user/user-admin-mant");
    }catch (err){
        console.error("Error during registration:", err.toString().split(" at ")[0]);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        res.redirect("/user/user-admin-mant");
    }
}


exports.GetAddEmployee = async (req,res,next)=> {
    let roles = await roleModel.findAll({where:{Id:{[Op.or]:[
        Roles.Employee,
        Roles.Manager
    ] }} });

    roles = roles.map((r) => r.dataValues);

    res.render("UserViews/user-add-edit-users",{
    userToUpdate: {},
    rolesToUse: roles,
    title: "SAVE EMPLOYEE",
    EditMode: false, 
});
}


exports.PostAddEmployee = async (req,res,next)=>{
    try{
        const {
            Name,
            LastName,
            UserName,
            RoleId,
            Email,
            Phone,
            Password,
            ConfirmPassword,
        } = req.body;
        const Photo = req.file;

        let userWithSameCredentials  = await userModel.findOne({ where:{Email: Email}});

        if(userWithSameCredentials){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the email, "+ Email);
          return  res.redirect("/user/user-employee-add");
        }

        userWithSameCredentials  = await userModel.findOne({ where:{UserName: UserName}});

        if(userWithSameCredentials){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "There is allready a user with the username, "+ UserName);
            return res.redirect("/user/user-employee-add");
        }

        if(Password != ConfirmPassword){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "passwords dont match");
            return  res.redirect("/user/user-employee-add");
        }
            
       const  hashPass = await bycrypt.hash(Password, 12);
        
     await userModel.create({
            Name,
            LastName,
            UserName,
            Email,
            Cedula: "",
            Photo: "/" + Photo.path,
            Phone,
            CommerceId: res.locals.UserInfo.CommerceId,
            Password: hashPass,
            RoleId: RoleId,
        });
        req.flash(UIMessagesNamesForFlash.SuccessMessageName, "The employee has been created successfully"); 
        res.redirect("/user/user-employee-mant");
    }catch (err){
        console.error("Error during registration:", err.toString().split(" at ")[0]);
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        res.redirect("/user/user-employee-mant");
    }
}


exports.GetEditUser = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let user = await userModel.findOne({where: {Id:id ?? res.locals.UserInfo.Id}});
    
        res.render("UserViews/user-add-edit-users",{
            userToUpdate: user.dataValues,
            EditMode: true,
            rolesToUse: null,
            title: "UPDATE INFO",
            EditMode: true, 
        });

        }catch{
           res.redirect("back");
           console.error(err);
        }
}


exports.PostEditUser = async (req,res,next) =>{
    const {Id,   
        Name,
        LastName,
        Phone,
        PrevImage,} = req.body;
      let  Photo = req.file;

    try{

      
     await userModel.update({
        Name,
        LastName,
        Photo: Photo !=null? "/"+Photo.path : PrevImage,
        Phone ,
     },{where: {Id:Id}})
     req.flash(UIMessagesNamesForFlash.SuccessMessageName, "Your account info has been updated successfully"); 
     res.redirect("back")

   }catch(err){
     req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
     console.error(err);
     res.redirect("/user/user-edit/" + Id)
     
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
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
           console.error(err);
           res.redirect(back);
           
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
                req.flash(UIMessagesNamesForFlash.ErrorMessageName, "The passwords must match");
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
     req.flash(UIMessagesNamesForFlash.SuccessMessageName, "The admin has been edited successfully"); 
     res.redirect("/user/user-admin-mant")

   }catch(err){
     req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
     console.error(err);
     res.redirect("/user/user-admin-edit/" + Id);
     
   }
}

exports.PostDeleteUser = async (req,res,next) =>{
    const Id = req.body.Id;
    try{
       if(Id != res.locals.UserInfo.Id){
         await userModel.destroy({where: {Id:Id}});
           req.flash(UIMessagesNamesForFlash.SuccessMessageName, "The user has been deleted successfully"); 
          return res.redirect("back");
       }
       req.flash(UIMessagesNamesForFlash.InfoMessageName, "You whant to delete your own account?... really?"); 
      return res.redirect("back");

    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "An unexpected error happed");
        console.error(err);
        res.redirect("/user/user-mant");
    }
}

