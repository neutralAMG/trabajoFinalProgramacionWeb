const productModel = require("../Models/Product");
const categoryModel = require("../Models/Category");


exports.GetAllProducts = async (req,res,next) =>{
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId: req.user.CommerceId}});
        products = products.map((p) => p.dataValues);

        res.render("ProductsViews/product-mant",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch{
        console.error(err);
    }
}
exports.GetAllProductsByCommerceId = async (req,res,next) =>{
    const CommerceId = req.params.id;
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId:CommerceId}});
        products = products.map((p) => p.dataValues);

        res.render("ProductsViews/product-commerece",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch{
        console.error(err);
    }
}

exports.GetAllProductsByCategory = async (req,res,next) =>{
    const CategoryId = req.params.id;
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CategoryId:CategoryId, CommerceId: req.user.CommerceId}});
        products = products.map((p) => p.dataValues);

        res.render("ProductsViews/product-category",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch{
        console.error(err);
    }
}

exports.GetProductById = async (req,res,next) =>{
    const Id = req.params.id;
    try{
        let product = await productModel.findOne({include:[{model:categoryModel}], where:{ Id:Id, CommerceId: req.user.CommerceId}});

        res.render("ProductsViews/product-detail",{
            product: product.dataValues,
        } );
    }catch{
        console.error(err);
    }
}


exports.GetAddProduct = async (req,res,next) => {
    let categories = await productModel.findAll({where: { CommerceId:req.user.CommerceId }});
    res.render("ProductsViews/product-add",{  
    product: null,
    categories: categories.map((c) => c.dataValues),
    EditMode: false,
   });
}

exports.PostAddProduct = async (req,res,next) =>{
    const { Name, Description, Price, Discount, Photo, CategoryId,} = req.body;

    try{
     await productModel.create({
        Name,
        Description,
        Price,
        Discount,
        Photo,
        CategoryId,
        CommerceId: req.locals.UserInfo.CommerceId
     })

     res.redirect("/product/product-mant");
   }catch(err){
    res.redirect("/product/product-add");
    console.error(err);
   }
}

exports.GetEditProduct = async (req,res,next) =>{
    try{
        const id = req.params.id;
    
        let product = await productModel.findOne({where: {Id:id, CommerceId:req.user.CommerceId }});
        let categories = await productModel.findAll({where: { CommerceId: req.user.CommerceId }});
    
        res.render("ProductsViews/product-add",{
            product: product.dataValues,
            categories: categories.map((c) => c.dataValues),
            EditMode: true,
        });
    }catch{
        res.redirect("/product/product-mant");
        console.error(err);
    }
}


exports.PostEditProduct = async (req,res,next) =>{
    const {Id, Name, Description, Price, Photo, CategoryId,} = req.body;

    try{

     await productModel.update({
        Name,
        Description,
        Price,
        Photo,
        CategoryId,
     },{where: {Id:Id, CommerceId: req.user.CommerceId }})

     res.redirect("/product/product-mant")

   }catch(err){
     res.redirect("/product/product-edit/" + Id)
     console.error(err);
   }
}

exports.PostAddDiscoundProduct = async (req,res,next) =>{
    try{
        const {id, Discount} = req.body.id;

        await productModel.update({
            Discount: (Discount / 100)
         },{where: {Id:id, CommerceId: req.user.CommerceId }});

         res.redirect("/product/product-mant");
    }catch{
        res.redirect("/product/product-mant");
        console.error(err);
    }
}

exports.PostDeleteProduct = async (req,res,next) =>{
    const Id = req.body;

    try{
        await productModel.destroy({where: {Id:Id, CommerceId: req.user.CommerceId }});

        res.redirect("/product/product-mant");
    }catch (err){
        res.redirect("/product/product-mant");
        console.error(err);
    }
}