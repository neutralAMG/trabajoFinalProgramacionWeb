const productModel = require("../Models/Product");
const categoryModel = require("../Models/Category");


exports.GetAllProducts = async (req,res,next) =>{
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId: res.locals.UserInfo.CommerceId}});
        products = products.map((p) => p.dataValues);
        products = products.map((p) => {
            p.Discount = p.Discount  ? (Number(p.Discount * 100)) : 0;
            return p;
        });
        res.render("ProductsViews/product-mant",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch (err){
        console.error(err);
    }
}
exports.GetAllProductsByCommerceId = async (req,res,next) =>{
    const CommerceId = req.params.id;
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId:CommerceId}});
        products = products.map((p) => p.dataValues);
        products = products.map((p) => {
            p.Discount = p.Discount  ? (Number(p.Discount * 100)) : 0;
            return p;
        });

        res.render("ProductsViews/product-commerece",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch(err){
        console.error(err);
    }
}

exports.GetAllProductsByCategory = async (req,res,next) =>{
    const CategoryId = req.params.id;
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CategoryId:CategoryId, CommerceId: res.locals.UserInfo.CommerceId}});
        products = products.map((p) => p.dataValues);

        res.render("ProductsViews/product-category",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch(err){
        console.error(err);
    }
}

exports.GetProductById = async (req,res,next) =>{
    const Id = req.params.id;
    try{
        let product = await productModel.findOne({include:[{model:categoryModel}], where:{ Id:Id, CommerceId: res.locals.UserInfo.CommerceId}});

        res.render("ProductsViews/product-detail",{
            product: product.dataValues,
        } );
    }catch(err){
        console.error(err);
    }
}


exports.GetAddProduct = async (req,res,next) => {
    let categories = await categoryModel.findAll({where: { CommerceId:res.locals.UserInfo.CommerceId }});
    res.render("ProductsViews/product-add",{  
    product: null,
    categories: categories.map((c) => c.dataValues),
    EditMode: false,
   });
}

exports.PostAddProduct = async (req,res,next) =>{
    const { Name, Description, Price, Discount, CategoryId,} = req.body;
     const Photo = req.file;
    try{
     await productModel.create({
        Name,
        Description,
        Price,
        Discount,
        Photo: "/" + Photo.path ,
        CategoryId,
        CommerceId: res.locals.UserInfo.CommerceId
     })

     res.redirect("/product/prod-mant");
   }catch(err){
    res.redirect("/product/prod-add");
    console.error(err);
   }
}

exports.GetEditProduct = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let product = await productModel.findOne({where: {Id:id, CommerceId:res.locals.UserInfo.CommerceId }});
        let categories = await categoryModel.findAll({where: { CommerceId: res.locals.UserInfo.CommerceId }});
        res.render("ProductsViews/product-add",{
            product: product.dataValues,
            categories: categories.map((c) => c.dataValues),
            EditMode: true,
        });
    }catch(err){
        res.redirect("/product/prod-mant");
        console.error(err);
    }
}


exports.PostEditProduct = async (req,res,next) =>{
    const {Id, Name, Description, Price, CategoryId, PrevImage} = req.body;
   const Photo = req.file
    try{

     await productModel.update({
        Name,
        Description,
        Price,
        Photo: Photo != null ? "/" + Photo.path : PrevImage,
        CategoryId,
     },{where: {Id:Id, CommerceId: res.locals.UserInfo.CommerceId }})

     res.redirect("/product/prod-mant")

   }catch(err){
     res.redirect("/product/prod-edit/" + Id)
     console.error(err);
   }
}

exports.PostAddDiscoundProduct = async (req,res,next) =>{
    try{
        const {Id, Discount} = req.body;

        await productModel.update({
            Discount: (Discount / 100)
         },{where: {Id:Id, CommerceId: res.locals.UserInfo.CommerceId }});

         res.redirect("/product/prod-mant");
    }catch{
        res.redirect("/product/prod-mant");
        console.error(err);
    }
}

exports.PostDeleteProduct = async (req,res,next) =>{
    const Id = req.body;

    try{
        await productModel.destroy({where: {Id:Id, CommerceId: res.locals.UserInfo.CommerceId }});

        res.redirect("/product/prod-mant");
    }catch (err){
        res.redirect("/product/prod-mant");
        console.error(err);
    }
}