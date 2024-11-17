const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext");

const Order = require("Order",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    TotalBeforeTax:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    TotalAfterTax:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    AmountOfProducts:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Direction:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    OrderStatusId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    CommerceId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    ClientId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
     
}, {tableName: "Order"})

module.exports = Order