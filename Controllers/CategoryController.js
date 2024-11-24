const categoryModel = require("../Models/Category");


exports.GetAllCategory = async (req,res,next) =>{

    try{
        let categories = await categoryModel.findAll({where:{ CommerceId: res.locals.UserInfo.CommerceId}});
         categories = categories.map((c) => c.dataValues);

        res.render("CategoryViews/category-mant",{
            categories: categories,
            isEmpty: categories.length === 0,
        } );
    }catch{
        console.error(err);
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

     res.redirect("/category/category-mant");
   }catch(err){
    res.redirect("/category/category-add");
    console.error(err);
   }
   
}

exports.GetEditCategory = async (req,res,next) =>{

    try{
    const id = req.params.id;

    let category = await categoryModel.findOne({where: {Id:id, CommerceId:res.locals.UserInfo.CommerceId }});

    res.render("CategoryViews/category-add",{
        category: category.dataValues,
        EditMode: true,
    });
    }catch{
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

     res.redirect("/category/category-mant");

   }catch(err){
     res.redirect("/category/category-edit/" + Id);
     console.error(err);
   }
}

exports.PostDeleteCategory = async (req,res,next) =>{
    const Id = req.body;

    try{
        await categoryModel.destroy({where: {Id:Id, CommerceId:res.locals.UserInfo.CommerceId }});
        res.redirect("/category/category-mant");
    }catch (err){
        res.redirect("/category/category-mant");
        console.error(err);
    }
}