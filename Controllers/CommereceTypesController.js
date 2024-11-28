const commereceTypeModel = require("../Models/CommerceType");
const commereceModel = require("../Models/Commerce");
const {ErrorNameforFlash} = require("../Utils/ImportantENVVariables");

exports.GetAllCommereceType = async (req,res,next) =>{
    try{
        let commereceTypes = await commereceTypeModel.findAll({include:[{model:commereceModel }]});
        commereceTypes = commereceTypes.map((c) => c.dataValues);
        console.log(commereceTypes);
        
        commereceTypes = commereceTypes.map((c) => {
            c.commereceCount = c.Commerces.length
          return c;
        });

        res.render("CommerceTypeViews/commereceType-mant",{
            commereceTypes: commereceTypes,
            isEmpty: commereceTypes.length === 0,
        } );
    }catch (err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
        console.error(err);
        res.redirect("back");
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
        res.redirect("/commereceType/commerceType-mant");
    }catch(err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
       console.error(err);
      res.redirect("/commereceType/commerceType-add");
      
  }
}

exports.GetEditCommereceType = async (req,res,next) =>{
    try{
        const Id = req.params.id;
    
        let commerceType = await commereceTypeModel.findOne({where: {Id:Id}});
    
        res.render("CommerceTypeViews/commereceType-add",{
            commerceType: commerceType.dataValues,
            EditMode: true
        });
    }catch (err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
       res.redirect("/commereceType/commerceType-mant");
       console.error(err);
     }
}

exports.PostEditCommereceType = async (req,res,next) =>{
    const {Id, Name, Description } = req.body;
    const Icon = req.file
    try{

     await commereceTypeModel.update({
        Name,
        Description,
        Icon: Icon != null  ? "/"+Icon.path : PrevImage
     },{where: {Id:Id}})

     res.redirect("/commereceType/commerceType-mant");

   }catch(err){
    req.flash(ErrorNameforFlash, "Error while processing the request");
     res.redirect("/commereceType/commerceType-edit/" + Id)
     console.error(err);
   }
}

exports.PostDeleteCommereceType = async (req,res,next) =>{
    try{
        const Id = req.body.Id;
        await commereceTypeModel.destroy({where: {Id:Id}});
        res.redirect("/commereceType/commerceType-mant");
    }catch(err){
        req.flash(ErrorNameforFlash, "Error while processing the request");
        res.redirect("/commereceType/commerceType-mant");
        console.error(err);

    }
}