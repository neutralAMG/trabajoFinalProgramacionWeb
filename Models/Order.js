const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext");

const Order = connection.define("Order",{
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
    TaxApplied:{
        type: DataTypes.DECIMAL(3,2),
        allowNull: false,
    },
    HasBeenAssinged:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    DeliveryId:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
     
}, {tableName: "Order"})

module.exports = Order