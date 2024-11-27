const commereceTypeModel = require("../Models/CommerceType");

exports.GetAllCommereceType = async (req,res,next) =>{
    try{
        let commereceTypes = await commereceTypeModel.findAll();
        commereceTypes = commereceTypes.map((c) => c.dataValues);

        res.render("CommerceTypeViews/commereceType-mant",{
            commereceTypes: commereceTypes,
            isEmpty: commereceTypes.length === 0,
        } );
    }catch{
        console.error(err);
    }
    
}

exports.GetAddCommereceType = async (req,res,next) =>res.render("CommerceTypeViews/commereceType-add",{ commerceType: null, EditMode: false})


exports.PostAddCommereceType = async (req,res,next) =>{
    
   const { Name, Description } = req.body;
   const Icon = req.file;

   try{
    await commereceTypeModel.create({
       Name,
       Description,
       Icon: "/"+Icon.path
    });
        res.redirect("/commereceType/commereceType-mant");
    }catch(err){
      res.redirect("/commereceType/commereceType-add");
      console.error(err);
  }
}

exports.GetEditCommereceType = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let commereceType = await commereceTypeModel.findOne({where: {Id:id}});
    
        res.render("CommerceTypeViews/commereceType-add",{
            commereceType: commereceType.dataValues,
            EditMode: true
        });
    }catch{
       res.redirect("/commereceType/commereceType-mant");
       console.error(err);
     }
}

exports.PostEditCommereceType = async (req,res,next) =>{
    const {Id, Name, Description } = req.body;
    const Icon = req.file
    try{

     await categoryModel.update({
        Name,
        Description,
        Icon: Icon != null  ? "/"+Icon.path : PrevImage
     },{where: {Id:Id}})

     res.redirect("/commereceType/commereceType-mant");

   }catch(err){
     res.redirect("/category/category-edit/" + Id)
     console.error(err);
   }
}

exports.PostDeleteCommereceType = async (req,res,next) =>{
    try{
        const id = req.body.id;
        await commereceTypeModel.destroy({where: {Id:id}});
        res.redirect("/commereceType/commereceType-mant");
    }catch(err){
        res.redirect("/commereceType/commereceType-mant");
        console.error(err);

    }
}