const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const Commerece = connection.define("Commerce",{
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
     Phone:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
     Email:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
     Logo:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    IsActive:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    OpeningHour:{
        type: DataTypes.TIME,
        allowNull: false,
    }, 
    ClousingHour:{
        type: DataTypes.TIME,
        allowNull: false,
    }, 
     CommerceTypeId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{tableName: "Commerce"})


module.exports = Commerece