const {Roles} = require("../Utils/ImportantENVVariables")
module.exports = (role) =>{
    let url; 
    if (role === Roles.Admin) {
        url =  "/home/home-admin";
    }else if (role === Roles.Delivery) {
        url =  "/home/home-delivery";
    }else if (role === Roles.Client) {
        url =  "/home/home-client";
    }else{
        //Commerece
        url =  "/home/home-commerece";
    }
    return url;
}