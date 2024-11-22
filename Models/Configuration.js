const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const Configurations = connection.define("Configurations",{
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
    Value:{
        type: DataTypes.STRING,
        allowNull: false,
    },  
    Type:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{tableName: "Configurations"})


module.exports = Configurations