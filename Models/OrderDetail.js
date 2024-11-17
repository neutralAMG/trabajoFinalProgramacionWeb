const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const OrderDetails = connection.define("OrderDetails",{
    OrderId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }, 
     ProductId:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }, 
     ProductCost:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    }, 
    Discount:{
    type: DataTypes.DECIMAL(3,2),
    allowNull: false,
   },
},{
    tableName: "OrderDetails",
    timestamps: false
})


module.exports = OrderDetails