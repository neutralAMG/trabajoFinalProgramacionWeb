const userModel = require("../Models/User");

exports.GetAllUserClientMant = async (req,res,next) =>{
    try{
        let clients = await userModel.findAll({where:{ RoleId:2}});
        clients = clients.map((p) => p.dataValues);

        res.render("UserViews/user-client",{
            clients: clients,
            isEmpty: clients.length === 0,
        } );
    }catch{
        console.error(err);
    }
}

exports.GetAllUserDeliveryMant = async (req,res,next) =>{
    try{
        let deliveries = await userModel.findAll({where:{ RoleId:3}});
        deliveries = deliveries.map((p) => p.dataValues);

        res.render("UserViews/user-delivery",{
            deliveries: deliveries,
            isEmpty: deliveries.length === 0,
        } );
    }catch{
        console.error(err);
    }

}

exports.GetAllAdminUserMant = async (req,res,next) =>{
    try{
        let admins = await userModel.findAll({where:{ RoleId:1}});
        admins = admins.map((p) => p.dataValues);

        res.render("UserViews/user-admin",{
            admins: admins,
            isEmpty: admins.length === 0,
        } );
    }catch{
        console.error(err);
    }

}

exports.GetEditUser = async (req,res,next) =>{
    try{
        const id = req.params.id;

    
        let user = await userModel.findOne({where: {Id:id ?? res.locals.UserInfo.Id}});
    
        res.render("UserViews/user-edit",{
            category: user.dataValues,
            EditMode: true,
        });
        }catch{
            // make diferent by role
           res.redirect("/user/user-mant");
           console.error(err);
        }
}

exports.PostEditUser = async (req,res,next) =>{
    const {Id,   
        Name,
        UserName,
        Email,
        Cedula,
        Photo, 
        Password,
        ConfirmPassword,
        RoleId,
        CommerceId  } = req.body;
      let  Phone = req.file;

    try{

        if(Password != ConfirmPassword)
            res.redirect("/user/user-edit/" + Id);

     await userModel.update({
        Name,
        UserName,
        Email,
        Cedula,
        Photo, 
        Phone: "/"+Phone.path,
        IsActive,
        IsBusy,
        Password,
        ConfirmPassword,
        RoleId,
        CommerceId 
     },{where: {Id:Id}})

     res.redirect("/user/user-mant")

   }catch(err){
      // make diferent by role
     res.redirect("/user/user-edit/" + Id)
     console.error(err);
   }
}

exports.PostDeleteUser = async (req,res,next) =>{
    const Id = req.body;

    try{
        await userModel.destroy({where: {Id:Id}});
            // make diferent by role
        res.redirect("/user/user-mant");
    }catch (err){
            // make diferent by role
        res.redirect("/user/user-mant");
        console.error(err);
    }
}
