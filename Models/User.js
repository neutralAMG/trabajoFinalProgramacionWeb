const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const User = connection.define("User",{
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
     UserName:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
     Email:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    Cedula:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    Photo:{
       type: DataTypes.STRING,
       allowNull: false,
    },
    Phone:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    IsActive:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    IsBusy:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    Password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
     RoleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CommerceId:{
       type: DataTypes.INTEGER,
       allowNull: true,
   }
},{tableName: "User"})


module.exports = User