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
    },
    Photo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    CategoryId:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    CommerceId:{
        type: DataTypes.STRING,
        allowNull: false,
    },


},{tableName: "Product"})


module.exports = Product