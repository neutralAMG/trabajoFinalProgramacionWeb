const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const OrderDetails = connection.define("OrderDetails",{
    OrderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 
     ProductId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 
    AmountOfProduct:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
     ProductCost:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    }, 
    Discount:{
    type: DataTypes.DECIMAL(3,2),
    allowNull: true,
   },
},{
    tableName: "OrderDetails",
    timestamps: false
})


module.exports = OrderDetails