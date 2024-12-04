const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const Role = connection.define("Role",{
    Id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },  
    Name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{tableName: "Role"})


module.exports = Role