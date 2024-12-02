const orderModel = require("../Models/Order");
const orderDetailModel = require("../Models/OrderDetail");
const orderStatusModel = require("../Models/OrderStatus");
const orderUpdateModel = require("../Models/OrderUpdate");
const productModel = require("../Models/Product");
const  directionModel = require("../Models/Direction");
const categoryModel = require("../Models/Category");
const userModel = require("../Models/User");
const {Roles,OrderStatus} = require("../Utils/ImportantENVVariables");
const Order = require("../Models/Order");
const config = require("../Models/Configuration");
const OrderDetails = require("../Models/OrderDetail");
const {ErrorNameforFlash} = require("../Utils/ImportantENVVariables")

exports.GetAllUserOrders = async (req,res,next) => {
    try{
        let orders = await orderModel.findAll({
            include:[{model:orderDetailModel}, {model:orderStatusModel} ], 
            where:{ ClientId: res.locals.UserInfo.Id}});
        orders = orders.map((p) => p.dataValues);
        orders.sort((a,b) => b - a)
        res.render("OrdersViews/order-user-order",{
            orders: orders.sort((a,b) => b.createdAt - a.createdAt),
            isEmpty: orders.length === 0,
        } );

    }catch(err){
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }
}
exports.GetOrderDetail = async (req,res,next) =>{
    try{
        let order = await orderModel.findOne({include:[{model:orderDetailModel}, {model:orderStatusModel}, {model:orderUpdateModel}, ], /* where:{ Id:id ,ClientId: req.user.id}*/});
        const orderStatuses = await orderStatusModel.findAll();
        res.render("OrdersViews/order-detail",{
            order: order.dataValues,
            orderStatuses: orderStatuses.map((o) => o.dataValues),
        } );
    }catch{
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
    }
}
exports.GetAddOrder = async (req,res,next) =>{
    const id = req.params.id;
    try{
        let directions = await directionModel.findAll({where:{UserId: res.locals.UserInfo.Id}})
        let categories = await categoryModel.findAll({where:{ CommerceId:id}});
        categories =  categories.map((c) => c.dataValues);

        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId:id}});
        products =  products.map((p)=> p.dataValues);
        products =  products.map((p)=> {
            p.IntDiscount = (p.Discount * 100);
            return p;
        });

        console.log(products);
        console.log(categories);
        //TODO: pass the directions
        res.render("OrdersViews/order-add",{
            products: products,
            categories: categories,
            directions: directions.map((d) => d.dataValues),
            CommerceId: id,
            currentTax: Number((await config.findByPk(1)).dataValues.Value),
            isEmpty: products.length === 0,
        } );
    }catch{
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }
}

exports.PostAddOrder = async (req,res,next) =>{
    try {
        const OrderItems = req.body.OrderItems;
        const {
        TotalBeforeTax,
        TotalAfterTax, 
        TaxApplied,
        AmountOfProducts,
        Direction,
        CommerceId} = req.body
    
        const newOrder = await Order.create({
        TotalBeforeTax,
        TotalAfterTax, 
        TaxApplied,
        AmountOfProducts,
        Direction,
        OrderStatusId: OrderStatus.Created, 
        CommerceId, 
        ClientId: res.locals.UserInfo.Id,
        });
    
        const fullOrderDetails = OrderItems.map((o) => o.OrderId = newOrder.Id)
        await OrderDetails.bulkCreate(fullOrderDetails);
    
        res.redirect("/home/home-client");
    } catch (error) {
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }

    
    
}

exports.PostUpdateOrderStatus = async (req,res,next) =>{
    try{
       const {Id, OrderStatusId, Comment} = req.body;


      await orderUpdateModel.create({
          NewStatusId: OrderStatusId ?? null ,
          Comment: Comment ?? "",
          OrderId: Id,
      })
    
      res.redirect("/home/home-delivery"); 
    }catch (err){
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-delivery"); 
    }
    
}

exports.PostAssingOrder = async (req,res,next) =>{
    try{
       const freeDeliveries = await userModel.findAll({where:{IsBusy:false, RoleId:Roles.Delivery}});

    if(!freeDeliveries){
        req.flash(ErrorNameforFlash, "There are no free deliveries");
       return res.redirect("/home/home-Commerece");
    }
        

        await orderModel.update({
            DeliveryId: await freeDeliveries.map((d) => d.dataValues)[0].Id,
            HasBeenAssinged: true,
        },{where: {Id:id}});
        res.redirect("/home/home-Commerece");  
    }catch(err){
        req.flash(ErrorNameforFlash, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-Commerece"); 
    }
    
}

