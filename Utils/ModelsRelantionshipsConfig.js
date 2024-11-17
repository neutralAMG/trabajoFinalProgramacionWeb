const Category = require("../Models/Category");
const Direction = require("../Models/Direction");
const Commerce = require("../Models/Commerce");
const CommerceType = require("../Models/CommerceType");
const Order = require("../Models/Order");
const OrderStatus = require("../Models/OrderStatus");
const OrderDetail = require("../Models/OrderDetail");
const OrderUpdate = require("../Models/OrderUpdate");
const Product = require("../Models/Product");
const User = require("../Models/User");
const Role = require("../Models/Role");
const UserFavCommerce = require("../Models/UserFavCommerce");

exports.Config = () =>{
    Category.hasMany(Product, {foreignKey:"CategoryId", onDelete:"CASCADE", hooks:true});
    Product.belongsTo(Category, {foreignKey:"CategoryId", hooks:true});

    Product.hasMany(OrderDetail, {foreignKey:"ProductId", onDelete:"CASCADE", hooks:true});
    OrderDetail.belongsTo(OrderDetail, {foreignKey:"ProductId", hooks:true});

    Commerce.hasMany(Product, {foreignKey:"CommerceId", onDelete:"CASCADE", hooks:true});
    Product.hasMany(Commerce, {foreignKey:"CommerceId", hooks:true});

    CommerceType.hasMany(Commerce, {foreignKey:"CommerceTypeId", onDelete:"CASCADE", hooks:true});
    Commerce.hasMany(CommerceType, {foreignKey:"CommerceTypeId", hooks:true});

    Order.hasMany(OrderDetail, {foreignKey:"OrderId", onDelete:"CASCADE", hooks:true});
    OrderDetail.belongsTo(Order, {foreignKey:"OrderId", hooks:true});

    Order.hasMany(OrderUpdate, {foreignKey:"OrderId", onDelete:"CASCADE", hooks:true});
    OrderUpdate.belongsTo(Order, {foreignKey:"OrderId", hooks:true});

    OrderStatus.hasMany(Order, {foreignKey:"OrderStatusId", onDelete:"CASCADE", hooks:true});
    Order.belongsTo(OrderStatus, {foreignKey:"OrderStatusId", hooks:true});

    Commerce.hasMany(Order, {foreignKey:"CommerceId", onDelete:"CASCADE", hooks:true});
    Order.hasMany(Commerce, {foreignKey:"CommerceId", hooks:true});

    OrderStatus.hasMany(OrderUpdate, {foreignKey:"NewStatusId", onDelete:"CASCADE", hooks:true});
    OrderUpdate.belongsTo(OrderStatus, {foreignKey:"NewStatusId", hooks:true});

    Commerce.hasMany(User, {foreignKey:"CommerceId", onDelete:"CASCADE", hooks:true});
    User.belongsTo(Commerce, {foreignKey:"CommerceId", hooks:true})

    Commerce.hasMany(Category, {foreignKey:"CommerceId", onDelete:"CASCADE", hooks:true});
    Category.belongsTo(Commerce, {foreignKey:"CommerceId", hooks:true});

    Role.hasMany(User, {foreignKey:"RoleId", onDelete:"CASCADE", hooks:true});
    User.belongsTo(Role, {foreignKey:"RoleId", hooks:true});

    User.hasMany(Order, {foreignKey:"ClientId", onDelete:"CASCADE", hooks:true});
    Order.belongsTo(User, {foreignKey:"ClientId", hooks:true}); 
    
    User.hasMany(Order, {foreignKey:"DeliveryId", onDelete:"CASCADE", hooks:true});
    Order.belongsTo(User, {foreignKey:"DeliveryId", hooks:true});

    User.hasMany(Direction, {foreignKey:"UserId", onDelete:"CASCADE", hooks:true});
    Direction.belongsTo(User, {foreignKey:"UserId", hooks:true});

    User.hasMany(UserFavCommerce, {foreignKey:"UserId", onDelete:"CASCADE", hooks:true});
    UserFavCommerce.belongsTo(User, {foreignKey:"UserId", hooks:true});

    Commerce.hasMany(UserFavCommerce, {foreignKey:"CommerceId", onDelete:"CASCADE", hooks:true});
    UserFavCommerce.belongsTo(Commerce, {foreignKey:"CommerceId", hooks:true});
};
