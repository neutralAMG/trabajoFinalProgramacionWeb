const commereceTypeModel = require("../Models/CommerceType");
const commereceModel = require("../Models/Commerce");
const orderModel = require("../Models/Order");
const orderDetailModel = require("../Models/OrderDetail");
const orderStatusModel = require("../Models/OrderStatus");
const userModel = require("../Models/User");
const productModel = require("../Models/Product");
const {Roles} = require("../Utils/ImportantENVVariables");
const Commerece = require("../Models/Commerce");

exports.GetClientHome = async  (req,res,next)=>{
    try{
        let commereceTypes = await commereceTypeModel.findAll();
        commereceTypes = commereceTypes.map((c) => c.dataValues);
        res.render("HomeViews/home-client",{
            commereceTypes: commereceTypes,
            isEmpty: commereceTypes.length === 0,
        } );
    }catch (err){
        console.error(err);
    }
}

exports.GetDeliveryHome = async  (req,res,next)=>{
    try{
        let orders = await orderModel.findAll({
            
            include:[{model:orderDetailModel}, {model:orderStatusModel},{model: Commerece}, ], 
            where:{ Delivery: res.locals.UserInfo.Id}});
        orders = orders.map((p) => p.dataValues);
        orders.map((o) => {
            o.FormateDate = ("00" + (o.createdAt.getMonth() + 1)).slice(-2) 
            + "/" + ("00" + o.createdAt.getDate()).slice(-2) 
            + "/" + o.createdAt.getFullYear() + " " 
            + ("00" + o.createdAt.getHours()).slice(-2) + ":" 
            + ("00" + o.createdAt.getMinutes()).slice(-2) 

            return o;
        })

        res.render("HomeViews/home-delivery",{
            orders: orders.sort((a,b) => b.createdAt - a.createdAt),
            isEmpty: orders.length === 0,
        } );
    }catch (err){
        console.error(err);
    }

}

exports.GetCommereceHome = async (req,res,next)=>{
    try{

        let orders = await orderModel.findAll({
            include:[{model:orderDetailModel}, {model:orderStatusModel}, {model: Commerece}, ], 
            where:{ Id: res.locals.UserInfo.CommerceId}});
        orders = orders.map((p) => p.dataValues);
        orders.map((o) => {
            o.FormateDate = ("00" + (o.createdAt.getMonth() + 1)).slice(-2) 
            + "/" + ("00" + o.createdAt.getDate()).slice(-2) 
            + "/" + o.createdAt.getFullYear() + " " 
            + ("00" + o.createdAt.getHours()).slice(-2) + ":" 
            + ("00" + o.createdAt.getMinutes()).slice(-2) 

            return o;
        })
        res.render("HomeViews/home-commerce",{
            orders: orders.sort((a,b) => b.createdAt - a.createdAt),
            isEmpty: orders.length === 0,
        } );
    }catch (err){
        console.error(err);
    }
}

exports.GetAdminHome = async (req,res,next)=>{
    const metrics ={
        AmountOfOrders: 1,
        AmountOfOrdersToday:1,
        AmountOfClientsActive:1,
        AmountOfClientsUnActive:1,
        AmountOfCommereceActive:1,
        AmountOfCommereceUnActive:1,
        AmountOfDeliveryActive:1,
        AmountOfDeliveryUnActive:1,
        AmountOfProducts:1,
    }
    const orders =  (await orderModel.findAll()).map((o) => o.dataValues);
    const client =  (await userModel.findAll({where:{RoleId:Roles.Client}})).map((o) => o.dataValues);
    const delivery =  (await userModel.findAll({where:{RoleId:Roles.Delivery}})).map((o) => o.dataValues);
    const products =  (await productModel.findAll()).map((o) => o.dataValues);
    const commerece =  (await commereceModel.findAll()).map((o) => o.dataValues);

    metrics.AmountOfOrders = orders.length;
    metrics.AmountOfOrdersToday = orders.filter((o) => o.toUTCString() === new Date().toUTCString()).length;
    metrics.AmountOfClientsActive = client.filter((o) => o.IsActive === true).length;
    metrics.AmountOfClientsUnActive =  Math.abs(client.length - metrics.AmountOfClientsActive);
    metrics.AmountOfDeliveryActive = delivery.filter((o) => o.IsActive === true).length;
    metrics.AmountOfDeliveryUnActive =  Math.abs( delivery.length - metrics.AmountOfDeliveryActive);
    metrics.AmountOfCommereceActive = commerece.filter((o) => o.IsActive === true).length;
    metrics.AmountOfCommereceUnActive = Math.abs(commerece.length - metrics.AmountOfCommereceActive);
    metrics.AmountOfProducts = products.length;

    res.render("HomeViews/home-admin",{
        metrics: metrics
    });
    
}