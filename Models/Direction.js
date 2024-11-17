const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const Direction = connection.define("Direction",{
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
     UserId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{tableName: "Direction"})


module.exports = Direction