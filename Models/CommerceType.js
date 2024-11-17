const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const CommerceType = connection.define("CommerceType",{
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
     Icon:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{tableName: "CommerceType"})


module.exports = CommerceType