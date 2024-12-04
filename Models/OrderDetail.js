const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const OrderDetails = connection.define("OrderDetails",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    OrderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
     ProductId:{
        type: DataTypes.INTEGER,
        allowNull: false,
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