const orderModel = require("../Models/Order");
const orderDetailModel = require("../Models/OrderDetail");
const orderStatusModel = require("../Models/OrderStatus");
const orderUpdateModel = require("../Models/OrderUpdate");
const productModel = require("../Models/Product");
const categoryModel = require("../Models/Category");
const userModel = require("../Models/User");


exports.GetAllUserOrders = async (req,res,next) => {
    try{
        let orders = await orderModel.findAll({
            include:[{model:orderDetailModel}, {model:orderStatusModel} ], 
            where:{ ClientId: res.locals.UserInfo.Id},
        order:["createdAt", "DESC"] });
        orders = orders.map((p) => p.dataValues);

        res.render("OrdersViews/order-user-order",{
            orders: orders,
            isEmpty: orders.length === 0,
        } );
    }catch{
        console.error(err);
    }
}
exports.GetOrderDetail = async (req,res,next) =>{
    try{
        let order = await orderModel.findOne({include:[{model:orderDetailModel}, {model:orderStatusModel}, {model:orderUpdateModel}, ], where:{ Id:id ,ClientId: res.locals.UserInfo.Id}});

        res.render("OrdersViews/order-detail",{
            order: order.dataValues,

        } );
    }catch{
        console.error(err);
    }
}
exports.GetAddOrder = async (req,res,next) =>{
    const id = req.params;
    try{
        let products = await productModel.findAll({include:[{model:categoryModel}], where:{ CommerceId:id}});
        products =  products.map((c)=> c.dataValues)
        res.render("OrdersViews/order-add",{
            products: products,
            isEmpty: products.length === 0,
        } );
    }catch{
        console.error(err);
    }
}

exports.PostAddOrder = async (req,res,next) =>{
    
    
}

exports.PostUpdateOrderStatus = async (req,res,next) =>{
    try{
       const {id, OrderStatusId, prevOrderStatus, Comment} = req.body;
      if(OrderStatusId){
          await orderModel.update({
              OrderStatusId,
          },{where: {Id:id}});
      }

      await orderUpdateModel.create({
          NewStatusId: OrderStatusId ?? prevOrderStatus ,
          Comment: Comment ?? "",
          OrderId: id,
      })
    
      res.redirect("/home/home-client"); 
    }catch (err){
        console.error(err);
    }
    
}

exports.PostAssingOrder = async (req,res,next) =>{
    try{
       const freeDeliveries = userModel.findAll({where:{IsBusy:false, RoleId:3}});

    if(!freeDeliveries)
        res.redirect("");

        await orderModel.update({
            DeliveryId: (await freeDeliveries).map((d) => d.dataValues)[0].Id,
            HasBeenAssinged: true,
        },{where: {Id:id}});
        res.redirect("/home/home-Commerece");  
    }catch(err){
        console.error(err);
    }
    
}

