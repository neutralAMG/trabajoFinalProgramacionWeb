const OrderStatuses = require("../Models/OrderStatus");
const Role = require("../Models/Role");
const Config = require("../Models/Configuration");
const {ConfigurationValueTypes} = require("./ImportantENVVariables")
const User = require("../Models/User");
const CommerceType = require("../Models/CommerceType");
const Commerece = require("../Models/Commerce");
const Direction = require("../Models/Direction");
const Category = require("../Models/Category");
const bycrypt = require("bcryptjs");
const {Roles} = require("../Utils/ImportantENVVariables")

//Orderstatuses
const orderStatusesToSeed =[ 
    {  Name: "Created"},
    { Name: "In progress" },
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

const commereceTypes =[
    {
    Name:" Pizzeria", 
     Description: "Tienda de pizza", 
     Icon: "/Images/SeedImages/colorful-icon-of-pizza-isolated-on-white-background-vector.jpg",
},
{
    Name:" Cafeteria", 
     Description: "Tienda de cafe", 
     Icon: "/Images/SeedImages/cofe.png",
},
{
    Name:" Restaurante", 
     Description: "Restaurante", 
     Icon: "/Images/SeedImages/images (1).png",
}
]

const DefaultCategories = [
    {
        Name: "Entradas",
        Description: "Productos o servicios que son la primera parte de una comida o experiencia, como aperitivos o entradas.",
        CommerceId: null, // Reemplaza con el ID del comercio correspondiente
    },
    {
        Name: "Platos Fuertes",
        Description: "Platos principales y sustanciosos, como carnes, pescados, pastas, y otros platos completos.",
        CommerceId: null, // Reemplaza con el ID del comercio correspondiente
    },
    {
        Name: "Postres",
        Description: "Productos dulces o de cierre para una comida, como pasteles, helados o bebidas frías.",
        CommerceId: null, // Reemplaza con el ID del comercio correspondiente
    },
    {
        Name: "Bebidas",
        Description: "Categoría para bebidas, tanto alcohólicas como no alcohólicas, como jugos, refrescos, cervezas o cócteles.",
        CommerceId: null, // Reemplaza con el ID del comercio correspondiente
    },
];

const DefaultCommerces = [
    {
        Name: "Pizza Palace",
        Phone: "111-111-1111",
        Email: "pizzapalace@example.com",
        Logo: "/Images/SeedImages/banner-3.jpg",
        IsActive: true,
        OpeningHour: "09:00:00",
        ClousingHour: "22:00:00",
        CommerceTypeId: 1, // Pizzeria
    },
    {
        Name: "Coffee Haven",
        Phone: "222-222-2222",
        Email: "coffeehaven@example.com",
        Logo: "/Images/SeedImages/imagesCoffe.jpg",
        IsActive: true,
        OpeningHour: "07:00:00",
        ClousingHour: "18:00:00",
        CommerceTypeId: 2, // Cafeteria
    },
    {
        Name: "Gourmet Bistro",
        Phone: "333-333-3333",
        Email: "gourmetbistro@example.com",
        Logo: "/Images/SeedImages/imagesRestaurant.jpg",
        IsActive: true,
        OpeningHour: "10:00:00",
        ClousingHour: "23:00:00",
        CommerceTypeId: 3, // Restaurante
    },
    {
        Name: "Pizza Haven",
        Phone: "444-444-4444",
        Email: "pizzahaven@example.com",
        Logo: "/Images/SeedImages/Pizza+Palace+Online+Ordering+Image.jpg",
        IsActive: true,
        OpeningHour: "11:00:00",
        ClousingHour: "20:00:00",
        CommerceTypeId: 1, // Pizzeria
    },
];


const DefaultUsers = [
    // Admin
    {
        Name: "Armando",
        LastName: "Pepe",
        UserName: "admin",
        Email: "admin@example.com",
        Cedula: "1234567890",
        Photo: "/Images/SeedImages/istockphoto-1388645967-612x612.jpg",
        Phone: "123-456-7890",
        IsActive: true,
        IsBusy: false,
        Password: "admin123",
        RoleId: Roles.Admin,
        CommerceId: null,
    },
    // Client
    {
        Name: "Jhom",
        LastName: "Doe",
        UserName: "client1",
        Email: "client1@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        Phone: "111-222-3333",
        IsActive: true,
        IsBusy: false,
        Password: "client123",
        RoleId: Roles.Client, // Assuming RoleId 2 is for Client
        CommerceId: null,
    },
    // Managers
    {
        Name: "Clara",
        LastName: "Martinez",
        UserName: "manager1",
        Email: "manager1@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/depositphotos_13720689-stock-photo-young-businesswoman.jpg",
        Phone: "222-333-4444",
        IsActive: true,
        IsBusy: false,
        Password: "manager123",
        RoleId: Roles.Manager, // Assuming RoleId 3 is for Manager
        CommerceId: 1, // Example CommerceId
    },
    {
        Name: "Misko",
        LastName: "Jonez",
        UserName: "manager2",
        Email: "manager2@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/istockphoto-1388645967-612x612.jpg",
        Phone: "222-333-5555",
        IsActive: true,
        IsBusy: false,
        Password: "manager123",
        RoleId: Roles.Manager,
        CommerceId: 2,
    },
    {
        Name: "Ryn",
        LastName: "Lin",
        UserName: "manager3",
        Email: "manager3@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        Phone: "222-333-6666",
        IsActive: true,
        IsBusy: false,
        Password: "manager123",
        RoleId: Roles.Manager,
        CommerceId: 3,
    },
    {
        Name: "Mandy",
        LastName: "Reyez",
        UserName: "manager4",
        Email: "manager4@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
        Phone: "222-333-7777",
        IsActive: true,
        IsBusy: false,
        Password: "manager123",
        RoleId: Roles.Manager,
        CommerceId: 4,
    },
    // Deliveries
    {
        Name: "Lara",
        LastName: "Raith",
        UserName: "delivery1",
        Email: "delivery1@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
        Phone: "333-444-5555",
        IsActive: true,
        IsBusy: false,
        Password: "delivery123",
        RoleId: Roles.Delivery, // Assuming RoleId 4 is for Delivery
        CommerceId: null,
    },
    {
        Name: "Susan",
        LastName: "Martinez",
        UserName: "delivery2",
        Email: "delivery2@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/depositphotos_13720689-stock-photo-young-businesswoman.jpg",
        Phone: "333-444-6666",
        IsActive: true,
        IsBusy: false,
        Password: "delivery123",
        RoleId: Roles.Delivery,
        CommerceId: null,
    },
    {
        Name: "Tyron",
        LastName: "Marcus",
        UserName: "delivery3",
        Email: "delivery3@example.com",
        Cedula: null,
        Photo: "/Images/SeedImages/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
        Phone: "333-444-7777",
        IsActive: true,
        IsBusy: false,
        Password: "delivery123",
        RoleId: Roles.Delivery,
        CommerceId: null,
    },
];

const DefaultClientAddresses = [
    {
        Name: "Casa",
        Description: "Calle Duarte #102, Santiago de los Caballeros",
        UserId: 2, 
    },
    {
        Name: "Trabajo",
        Description: "Avenida Abraham Lincoln #35, Santo Domingo",
        UserId: 2,
    },
];
const Configuration = {
    Name: "ITBS",  
    Value:"0.18",  
    Type: ConfigurationValueTypes.int
}

exports.GenerateSeeds = async ()=>{

    try{
    const orderstatuses = await OrderStatuses.findOne();
    const roles = await Role.findOne();
    const users = await User.findOne();
    const configs = await Config.findOne();
    const cTypes = await CommerceType.findOne();
    const commereces = await Commerece.findOne();
    const Directions = await Direction.findOne();
    const Categories = await Category.findOne();
    if(!orderstatuses)
        await OrderStatuses.bulkCreate(orderStatusesToSeed);

    if(!roles)
      await  Role.bulkCreate(rolesToSeed);

    if (!cTypes) {
        await CommerceType.bulkCreate(commereceTypes)
    }

    if(!commereces){
        await Commerece.bulkCreate(DefaultCommerces)
    }
   if (!Categories) {
    let n = 1;
    for(const commerce of DefaultCommerces){
        DefaultCategories.map((c) =>{
            c.CommerceId = n;
            return c;
        })
        Category.bulkCreate(DefaultCategories)
        n++;
    }
    
   }
    if(!users){
       for(const u of DefaultUsers){
            u.Password = await bycrypt.hash(u.Password ,12);
        }
        await  User.bulkCreate(DefaultUsers);    
    }
    if(!Directions){
        await Direction.bulkCreate(DefaultClientAddresses);
    }
        
    if(!configs)
        await  Config.create(Configuration); 

    console.info("Seeds ran without problems")
    }catch(err){
        console.error(err);
    }
     
}