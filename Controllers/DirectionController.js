const directionModel = require("../Models/Direction");
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");

exports.GetAllUserDirection = async (req,res,next) =>{
    try{
        let directions = await directionModel.findAll({where: {UserId: res.locals.UserInfo.Id}});
        directions = directions.map((c) => c.dataValues);

        res.render("DirectionViews/direction-mant",{
            directions: directions,
            isEmpty: directions.length === 0,
        } );
    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.GetAddDirection = async (req,res,next) => res.render("DirectionViews/direction-add",{  
    direction: null,
    EditMode: false});

exports.PostAddDirection = async (req,res,next) =>{
    const { Name, Description } = req.body;

    try{
     await directionModel.create({
        Name,
        Description,
        UserId: res.locals.UserInfo.Id
     })

     req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The address has been created succesfully");
     res.redirect("/direction/direction-mant");
   }catch(err){
    req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
    res.redirect("/direction/direction-add");
    console.error(err);
   }
}

exports.GetEditDirection = async (req,res,next) =>{

    try{
        const Id = req.params.id;
    
        let direction = await directionModel.findOne({where: {Id:Id, UserId:res.locals.UserInfo.Id }});
    
        res.render("DirectionViews/direction-add",{
            direction: direction.dataValues,
            EditMode: true
        });
        }catch (err){
            req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
           res.redirect("/direction/direction-mant");
           console.error(err);
    }
    
}

exports.PostEditDirection = async (req,res,next) =>{
    const {Id, Name, Description } = req.body;

    try{

     await directionModel.update({
        Name,
        Description,
     },{where:{Id:Id, UserId:res.locals.UserInfo.Id}})
     req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The address has been updated succesfully");
     res.redirect("/direction/direction-mant")

   }catch(err){
    req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
     res.redirect("/direction/direction-edit/" + Id)
     console.error(err);
   }
}

exports.PostDeleteDirection = async (req,res,next) =>{
    const Id = req.body.Id;

    try{
        await directionModel.destroy({where: {Id:Id, UserId: res.locals.UserInfo.Id }});
        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The address has been deleted succesfully");
        res.redirect("/direction/direction-mant");
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        res.redirect("/direction/direction-mant");
        console.error(err);
    }
}