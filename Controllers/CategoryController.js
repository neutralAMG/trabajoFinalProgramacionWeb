const categoryModel = require("../Models/Category");
const Commerce = require("../Models/Commerce");
const Product = require("../Models/Product");
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");


exports.GetAllCategory = async (req,res,next) =>{

    try{
        let categories = await categoryModel.findAll({include:[{model:Product }],where:{ CommerceId: res.locals.UserInfo.CommerceId}});
         categories = categories.map((c) => c.dataValues);
     
         
         categories = categories.map((c) => {
            c.amountProduct = c.Products.length;
            return c;
         });

        res.render("CategoryViews/category-mant",{
            categories: categories,
            isEmpty: categories.length === 0,
        } );
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.location(req.get("Referrer") || "/") 
    }
    

}

exports.GetAddCategory = async (req,res,next) => res.render("CategoryViews/category-add",{  
    category: null,
    EditMode: false,});


exports.PostAddCategory = async  (req,res,next) =>{
    

   const { Name, Description } = req.body;

    try{
     await categoryModel.create({
        Name,
        Description,
        CommerceId: res.locals.UserInfo.CommerceId
     });

     req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The category has been created");
     res.redirect("/category/category-mant");
   }catch(err){
    req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
    res.redirect("/category/category-add");
    console.error(err);
   }
   
}

exports.GetEditCategory = async (req,res,next) =>{

    try{
    const id = req.params.id;

    let category = await categoryModel.findOne({where: {Id:id, CommerceId:res.locals.UserInfo.CommerceId}});

    res.render("CategoryViews/category-add",{
        category: category.dataValues,
        EditMode: true,
    });
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
       res.redirect("/category/category-mant");
       console.error(err);
    }
}

exports.PostEditCategory = async (req,res,next) =>{
    
   const {Id, Name, Description } = req.body;

    try{

     await categoryModel.update({
        Name,
        Description,
     },{where: {Id:Id, CommerceId:res.locals.UserInfo.CommerceId }});

     req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The category has been updated succesfully");
     res.redirect("/category/category-mant");

   }catch(err){
     req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
     res.redirect("/category/category-edit/" + Id);
     console.error(err);
   }
}

exports.PostDeleteCategory = async (req,res,next) =>{
    const Id = req.body.Id;

    try{
        await categoryModel.destroy({where: {Id:Id, CommerceId:res.locals.UserInfo.CommerceId}});

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The category has been deleted succesfully");
        res.redirect("/category/category-mant");
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        res.redirect("/category/category-mant");
        console.error(err);
    }
}