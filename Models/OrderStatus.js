const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const OrderStatus = connection.define("OrderStatus",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },  
    Name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{tableName: "OrderStatus"})


module.exports = OrderStatus