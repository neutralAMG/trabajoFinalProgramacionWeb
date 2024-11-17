const {DataTypes} = require("sequelize");
const connection = require("../Context/applicationContext")

const UserFavCommerce = connection.define("UserFavCommerce",{
    UserId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },  
    CommerceId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    }
},{tableName: "UserFavCommerce",
    timestamps: false,
})


module.exports = UserFavCommerce