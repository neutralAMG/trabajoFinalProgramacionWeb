const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const Product = connection.define("Product",{
    Id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },  
    Name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    Discount:{
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
        defaultValue: 0,
    },
    Photo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    CategoryId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CommerceId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },


},{tableName: "Product"})


module.exports = Product