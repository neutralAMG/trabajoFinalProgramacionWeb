const OrderStatuses = require("../Models/OrderStatus");
const Role = require("../Models/Role");
const Config = require("../Models/Configuration");

const User = require("../Models/User");


//Orderstatuses
const orderStatusesToSeed =[ 
    {  Name: "Created"},
    { Name: "In progress" },
    { Name: "Food picked up" },
    {  Name: "On delivery"},
    { Name: "Pending completion confirmation"},
    { Name: "Cancel"},
    { Name: "Completed"}
]

//roles
const rolesToSeed =[
    {  Name: "Admin"},
    { Name: "Client" },
    { Name: "Delivery" },
    {  Name: "Employee"},
    { Name: "Manager"}
]
//AdminUser

const DefaultAdminUser = {
 
        Name: "Admin User",
        UserName: "admin",
        Email: "admin@example.com",
        Cedula: "1234567890",
        Photo: "admin_photo_url", 
        Phone: "123-456-7890",
        IsActive: true,
        IsBusy: false,
        Password: "123qwea", 
        RoleId: 1, 
        CommerceId: null, 
}

const Configuration = {
    Name: "ITBS",  
    Value:"0.18",  
    Type:"Int"
}

exports.GenerateSeeds = async ()=>{

    try{
       const orderstatuses = await OrderStatuses.findOne();
    const roles = await Role.findOne();
    const users = await User.findOne({where: {UserName: DefaultAdminUser.UserName}});
    const configs = await Config.findOne();

    if(!orderstatuses)
        await OrderStatuses.bulkCreate(orderStatusesToSeed);

    if(!roles)
      await  Role.bulkCreate(rolesToSeed);

    if(!users)
        await  User.create(DefaultAdminUser);    
    
    if(!configs)
        await  Config.create(Configuration); 

    console.info("Seeds ran without problems")
    }catch(err){
        console.error(err);
    }
     
}