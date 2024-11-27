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
    LastName:{
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
        allowNull: true,
    }, 
    Photo:{
       type: DataTypes.STRING,
       allowNull: true,
    },
    Phone:{
        type: DataTypes.STRING,
        allowNull: true,
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
   },
   ResetToken:{
    type: DataTypes.STRING,
    allowNull: true,
   },
   ResetTokenExpiration:{
    type: DataTypes.DATE,
    allowNull: true,
   }
},{tableName: "User"})


module.exports = User