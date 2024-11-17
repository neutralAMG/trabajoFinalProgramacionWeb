const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const orderUpdates = connection.define("orderUpdates",{
    OrderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },  
    NewStatusId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Comment:{
        type: DataTypes.STRING,
        allowNull: false,
    },

},{tableName: "orderUpdates"})


module.exports = orderUpdates