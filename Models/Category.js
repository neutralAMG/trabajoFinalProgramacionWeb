const {DataTypes} = require("sequelize")
const connection = require("../Context/applicationContext");

const Category = connection.define("Category",{
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
    CommerceId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {tableName: "Category"})

module.exports = Category