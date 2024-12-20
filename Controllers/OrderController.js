const orderModel = require("../Models/Order");
const orderDetailModel = require("../Models/OrderDetail");
const orderStatusModel = require("../Models/OrderStatus");
const orderUpdateModel = require("../Models/OrderUpdate");
const productModel = require("../Models/Product");
const  directionModel = require("../Models/Direction");
const categoryModel = require("../Models/Category");
const userModel = require("../Models/User");
const {Roles,OrderStatus, UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");
const Order = require("../Models/Order");
const config = require("../Models/Configuration");
const OrderDetails = require("../Models/OrderDetail");
const Commerece = require("../Models/Commerce");
const Product = require("../Models/Product");
const User = require("../Models/User");

exports.GetAllUserOrders = async (req,res,next) => {
    try{
        let orders = await orderModel.findAll({
            include:[{model:orderDetailModel}, {model:orderStatusModel},{model:Commerece} ], 
            where:{ ClientId: res.locals.UserInfo.Id}});
        orders = orders.map((p) => p.dataValues);
        orders.map((o) => {
            o.FormateDate = ("00" + (o.createdAt.getMonth() + 1)).slice(-2) 
            + "/" + ("00" + o.createdAt.getDate()).slice(-2) 
            + "/" + o.createdAt.getFullYear() + " " 
            + ("00" + o.createdAt.getHours()).slice(-2) + ":" 
            + ("00" + o.createdAt.getMinutes()).slice(-2) 

            return o;
        })
        
        res.render("OrdersViews/order-user-order",{
            orders: orders.sort((a,b) => b.createdAt - a.createdAt),
            isEmpty: orders.length === 0,
        } );

    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }
}
exports.GetOrderDetail = async (req,res,next) =>{
   
    try{
        const id = req.params.id
        let order;
        if(res.locals.UserInfo.RoleId === Roles.Client){
            order = await orderModel.findOne({include:[{model:orderDetailModel, include: [{model: Product}]}, {model:orderStatusModel}, {model:orderUpdateModel}, {model: Commerece}], where:{ Id:id, ClientId: res.locals.UserInfo.Id}});
        }else if(res.locals.UserInfo.RoleId === Roles.Delivery){
            order = await orderModel.findOne({include:[{model:orderDetailModel, include: [{model: Product}]}, {model:orderStatusModel}, {model:orderUpdateModel}, {model: Commerece}], where:{ Id:id , DeliveryId: res.locals.UserInfo.Id}});
        }else if (res.locals.UserInfo.RoleId === Roles.Employee || res.locals.UserInfo.RoleId === Roles.Manager ) {
            order = await orderModel.findOne({include:[{model:orderDetailModel, include: [{model: Product}]}, {model:orderStatusModel}, {model:orderUpdateModel},{model: Commerece} ], where:{ Id:id , CommerceId: res.locals.UserInfo.CommerceId}});
        }
        
        order = order.dataValues;
        console.log(order);
        
        order.FormateDate = ("00" + (order.createdAt.getMonth() + 1)).slice(-2) 
            + "/" + ("00" + order.createdAt.getDate()).slice(-2) 
            + "/" + order.createdAt.getFullYear() + " " 
            + ("00" + order.createdAt.getHours()).slice(-2) + ":" 
            + ("00" + order.createdAt.getMinutes()).slice(-2) 

        res.render("OrdersViews/order-detail",{
            order: order,
        } );
    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("back");
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

        console.log(products)
        res.render("OrdersViews/order-add",{
            products: products,
            categories: categories,
            directions: directions.map((d) => d.dataValues),
            CommerceId: id,
            currentTax: Number((await config.findByPk(1)).dataValues.Value),
            isEmpty: products.length === 0,
        } );
    }catch{
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }
}

exports.PostAddOrder = async (req,res,next) =>{
    try {
        
        let OrderItems = req.body.OrderItems;
        OrderItems = JSON.parse(OrderItems) 
        console.log(OrderItems);
        let AmountOfProducts = 0;
        
        OrderItems.forEach(element => {
            AmountOfProducts +=  element.AmountOfProduct;
        });
        delete OrderItems.ProductName
        const {
        TotalBeforeTax,
        TotalAfterTax, 
        TaxApplied,
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
    
        const fullOrderDetails = OrderItems.map((o) => {
            o.OrderId = newOrder.Id
            return o;
        })
        console.log(fullOrderDetails);
        
        await OrderDetails.bulkCreate(fullOrderDetails);
        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The order has been created succesfully");
        res.redirect("/home/home-client");
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-client");
    }

    
    
}

exports.PostUpdateOrderStatus = async (req,res,next) =>{
    try{
       const {Id, DeliveryId} = req.body;

      await orderModel.update({
        OrderStatusId: OrderStatus.Completed,
    },{where: {Id:Id}});

    await User.update({
        IsBusy: false,
    }, {where:{Id:DeliveryId}})
    req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The order has been completed succesfully");
      res.redirect("/home/home-delivery"); 
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-delivery"); 
    }
    
}

exports.PostAssingOrder = async (req,res,next) =>{
    try{
        const Id = req.body.Id
       const freeDeliveries = await userModel.findAll({where:{IsBusy:false, RoleId:Roles.Delivery, IsActive: true}});

    if(freeDeliveries.length === 0){
        req.flash(UIMessagesNamesForFlash.InfoMessageName, "There are no free deliveries");
       return res.redirect("/home/home-Commerece");
    }
        const freeDelivery = freeDeliveries.map((d) => d.dataValues)[0];

        await orderModel.update({
            DeliveryId: freeDelivery.Id,
            HasBeenAssinged: true,
            OrderStatusId: OrderStatus.InProgress,
        },{where: {Id:Id}});

        await User.update({
            IsBusy: true,
        }, {where:{Id:freeDelivery.Id}})

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  `The order has been assing to the delivery ${freeDelivery.Name} succesfully`);
        res.redirect("/home/home-Commerece");  
    }catch(err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while preforming the operation");
        console.error(err);
        res.redirect("/home/home-Commerece"); 
    }
    
}

