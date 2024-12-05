const OrderStatuses = require("../Models/OrderStatus");
const Role = require("../Models/Role");
const Config = require("../Models/Configuration");
const {ConfigurationValueTypes} = require("./ImportantENVVariables")
const User = require("../Models/User");
const CommerceType = require("../Models/CommerceType");
const Commerece = require("../Models/Commerce");
const Direction = require("../Models/Direction");
const Category = require("../Models/Category");
const Product = require("../Models/Product");
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

const Defaultproducts = [
    // Pizza Palace Products
    // Entradas
    { Name: "Breadsticks", Description: "Delicious breadsticks with marinara sauce", Price: 4.99, Discount: 0, Photo: "/Images/SeedImages/SW260120-56-2.jpg", CategoryId: 1, CommerceId: 1 },
    { Name: "Mozzarella Sticks", Description: "Crispy mozzarella cheese sticks with marinara sauce", Price: 5.49, Discount: 0, Photo: "/Images/SeedImages/SW260120-56-2.jpg",  CategoryId: 1, CommerceId: 1 },
    { Name: "Garlic Knots", Description: "Soft, garlicky bread knots served with marinara", Price: 4.49, Discount: 0, Photo: "/Images/SeedImages/garlic_knots.jpg", CategoryId: 1, CommerceId: 1 },

    // Platos Fuertes
    { Name: "Margherita Pizza", Description: "Classic pizza with tomato, mozzarella, and basil", Price: 9.99, Discount: 0, Photo: "/Images/SeedImages/margherita_pizza.jpg", CategoryId: 2, CommerceId: 1 },
    { Name: "Pepperoni Pizza", Description: "Pizza topped with pepperoni and cheese", Price: 10.99, Discount: 0, Photo: "/Images/SeedImages/pepperoni_pizza.jpg", CategoryId: 2, CommerceId: 1 },
    { Name: "Vegetarian Pizza", Description: "Pizza with a variety of fresh vegetables", Price: 11.49, Discount: 0, Photo: "/Images/SeedImages/vegetarian_pizza.jpg", CategoryId: 2, CommerceId: 1 },

    // Postres
    { Name: "Tiramisu", Description: "Italian dessert with layers of coffee-soaked cake", Price: 5.99, Discount: 0, Photo: "/Images/SeedImages/tiramisu.jpg", CategoryId: 3, CommerceId: 1 },
    { Name: "Cheesecake", Description: "Creamy cheesecake with a graham cracker crust", Price: 6.99, Discount: 0, Photo: "/Images/SeedImages/cheesecake.jpg", CategoryId: 3, CommerceId: 1 },
    { Name: "Chocolate Cake", Description: "Rich and moist chocolate cake with frosting", Price: 5.49, Discount: 0, Photo: "/Images/SeedImages/chocolate_cake.jpg", CategoryId: 3, CommerceId: 1 },

    // Bebidas
    { Name: "Soda", Description: "Refreshing soft drink", Price: 2.49, Discount: 0, Photo: "/Images/SeedImages/soda.jpg", CategoryId: 4, CommerceId: 1 },
    { Name: "Iced Tea", Description: "Chilled iced tea with a hint of lemon", Price: 2.99, Discount: 0, Photo: "/Images/SeedImages/iced_tea.jpg", CategoryId: 4, CommerceId: 1 },
    { Name: "Lemonade", Description: "Freshly squeezed lemonade", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/lemonade.jpg", CategoryId: 4, CommerceId: 1 },

    // Coffee Haven Products
    // Entradas
    { Name: "Croissant", Description: "Flaky buttery croissant", Price: 2.49, Discount: 0, Photo: "/Images/SeedImages/croissant.jpg", CategoryId: 5, CommerceId: 2 },
    { Name: "Quiche", Description: "Savory quiche with eggs, cheese, and vegetables", Price: 4.99, Discount: 0, Photo: "/Images/SeedImages/quiche.jpg", CategoryId: 5, CommerceId: 2 },
    { Name: "Bagels", Description: "Soft bagels with cream cheese", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/bagels.jpg", CategoryId: 5, CommerceId: 2 },

    // Platos Fuertes
    { Name: "Cappuccino", Description: "Espresso with steamed milk and foam", Price: 3.99, Discount: 0, Photo: "/Images/SeedImages/cappuccino.jpg", CategoryId: 6, CommerceId: 2 },
    { Name: "Latte", Description: "Espresso with steamed milk", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/latte.jpg", CategoryId: 6, CommerceId: 2 },
    { Name: "Americano", Description: "Espresso diluted with hot water", Price: 2.99, Discount: 0, Photo: "/Images/SeedImages/americano.jpg", CategoryId: 6, CommerceId: 2 },

    // Postres
    { Name: "Cheesecake", Description: "Rich and creamy cheesecake with a graham cracker crust", Price: 4.99, Discount: 0, Photo: "/Images/SeedImages/cheesecake.jpg", CategoryId: 7, CommerceId: 2 },
    { Name: "Chocolate Cake", Description: "Moist chocolate cake with rich frosting", Price: 5.49, Discount: 0, Photo: "/Images/SeedImages/chocolate_cake.jpg", CategoryId: 7, CommerceId: 2 },
    { Name: "Tiramisu", Description: "Classic Italian dessert with coffee and mascarpone", Price: 5.99, Discount: 0, Photo: "/Images/SeedImages/tiramisu.jpg", CategoryId: 7, CommerceId: 2 },

    // Bebidas
    { Name: "Hot Chocolate", Description: "Rich and creamy hot chocolate", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/hot_chocolate.jpg", CategoryId: 8, CommerceId: 2 },
    { Name: "Mocha", Description: "Espresso, chocolate, and steamed milk", Price: 4.49, Discount: 0, Photo: "/Images/SeedImages/mocha.jpg", CategoryId: 8, CommerceId: 2 },
    { Name: "Iced Coffee", Description: "Chilled coffee with milk and ice", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/iced_coffee.jpg", CategoryId: 8, CommerceId: 2 },

    { Name: "Bruschetta", Description: "Grilled bread with tomatoes, basil, and olive oil", Price: 5.49, Discount: 0, Photo: "/Images/SeedImages/bruschetta.jpg", CategoryId: 9, CommerceId: 3 },
   { Name: "Stuffed Mushrooms", Description: "Mushrooms filled with cheese and herbs", Price: 6.99, Discount: 0, Photo: "/Images/SeedImages/stuffed_mushrooms.jpg", CategoryId: 9, CommerceId: 3 },
   { Name: "Caprese Salad", Description: "Tomatoes, mozzarella, basil, and balsamic glaze", Price: 5.99, Discount: 0, Photo: "/Images/SeedImages/caprese_salad.jpg", CategoryId: 9, CommerceId: 3 },

// Platos Fuertes
{ Name: "Steak Frites", Description: "Grilled steak served with crispy French fries", Price: 14.99, Discount: 0, Photo: "/Images/SeedImages/steak_frites.jpg", CategoryId: 10, CommerceId: 3 },
{ Name: "Lamb Shank", Description: "Slow-cooked lamb shank served with mashed potatoes", Price: 16.99, Discount: 0, Photo: "/Images/SeedImages/lamb_shank.jpg", CategoryId: 10, CommerceId: 3 },
{ Name: "Grilled Salmon", Description: "Salmon fillet grilled to perfection with seasonal vegetables", Price: 13.99, Discount: 0, Photo: "/Images/SeedImages/grilled_salmon.jpg", CategoryId: 10, CommerceId: 3 },

// Postres
{ Name: "Crème Brûlée", Description: "Classic French dessert with caramelized sugar top", Price: 6.49, Discount: 0, Photo: "/Images/SeedImages/creme_brulee.jpg", CategoryId: 11, CommerceId: 3 },
{ Name: "Chocolate Mousse", Description: "Rich and creamy chocolate mousse with whipped cream", Price: 5.99, Discount: 0, Photo: "/Images/SeedImages/chocolate_mousse.jpg", CategoryId: 11, CommerceId: 3 },
{ Name: "Lemon Sorbet", Description: "Refreshing lemon sorbet served chilled", Price: 4.99, Discount: 0, Photo: "/Images/SeedImages/lemon_sorbet.jpg", CategoryId: 11, CommerceId: 3 },

// Bebidas
{ Name: "Red Wine", Description: "Rich and smooth red wine, perfect for pairing with meals", Price: 7.99, Discount: 0, Photo: "/Images/SeedImages/red_wine.jpg", CategoryId: 12, CommerceId: 3 },
{ Name: "Sparkling Water", Description: "Refreshing sparkling water", Price: 2.49, Discount: 0, Photo: "/Images/SeedImages/sparkling_water.jpg", CategoryId: 12, CommerceId: 3 },
{ Name: "Espresso", Description: "Strong and aromatic espresso", Price: 2.99, Discount: 0, Photo: "/Images/SeedImages/espresso.jpg", CategoryId: 12, CommerceId: 3 },

// Pizza Haven Products
// Entradas
{ Name: "Antipasto Platter", Description: "A selection of cured meats, cheeses, and olives", Price: 7.99, Discount: 0, Photo: "/Images/SeedImages/antipasto_platter.jpg", CategoryId: 13, CommerceId: 4 },
{ Name: "Bruschetta with Goat Cheese", Description: "Grilled bread topped with goat cheese and tomatoes", Price: 5.49, Discount: 0, Photo: "/Images/SeedImages/bruschetta_goat_cheese.jpg", CategoryId: 13, CommerceId: 4 },
{ Name: "Chicken Wings", Description: "Crispy chicken wings served with ranch dip", Price: 6.49, Discount: 0, Photo: "/Images/SeedImages/chicken_wings.jpg", CategoryId: 13, CommerceId: 4 },

// Platos Fuertes
{ Name: "BBQ Chicken Pizza", Description: "Pizza topped with barbecue chicken, cheese, and onions", Price: 11.49, Discount: 0, Photo: "/Images/SeedImages/bbq_chicken_pizza.jpg", CategoryId: 14, CommerceId: 4 },
{ Name: "Hawaiian Pizza", Description: "Pizza with ham, pineapple, and cheese", Price: 10.99, Discount: 0, Photo: "/Images/SeedImages/hawaiian_pizza.jpg", CategoryId: 14, CommerceId: 4 },
{ Name: "Marinara Pizza", Description: "Pizza topped with marinara sauce, garlic, and herbs", Price: 8.99, Discount: 0, Photo: "/Images/SeedImages/marinara_pizza.jpg", CategoryId: 14, CommerceId: 4 },

// Postres
{ Name: "Gelato", Description: "Italian-style ice cream in various flavors", Price: 4.49, Discount: 0, Photo: "/Images/SeedImages/gelato.jpg", CategoryId: 15, CommerceId: 4 },
{ Name: "Cannoli", Description: "Crispy pastry filled with sweet ricotta cheese", Price: 5.99, Discount: 0, Photo: "/Images/SeedImages/cannoli.jpg", CategoryId: 15, CommerceId: 4 },
{ Name: "Nutella Pizza", Description: "Pizza with Nutella spread and topped with fresh fruit", Price: 6.49, Discount: 0, Photo: "/Images/SeedImages/nutella_pizza.jpg", CategoryId: 15, CommerceId: 4 },

// Bebidas
{ Name: "Coca-Cola", Description: "Classic cola beverage", Price: 2.49, Discount: 0, Photo: "/Images/SeedImages/coca_cola.jpg", CategoryId: 16, CommerceId: 4 },
{ Name: "Iced Lemon Tea", Description: "Chilled lemon-flavored iced tea", Price: 2.99, Discount: 0, Photo: "/Images/SeedImages/iced_lemon_tea.jpg", CategoryId: 16, CommerceId: 4 },
{ Name: "Sparkling Lemonade", Description: "Refreshing sparkling lemonade", Price: 3.49, Discount: 0, Photo: "/Images/SeedImages/sparkling_lemonade.jpg", CategoryId: 16, CommerceId: 4 }
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
        RoleId: Roles.Client, 
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
        RoleId: Roles.Manager, 
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
        RoleId: Roles.Delivery, 
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
     const Products = await Product.findOne();
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

   if (!Products) {
    for(const product of Defaultproducts){
        product.Photo = "/Images/SeedImages/SW260120-56-2.jpg";
        await Product.create(product);
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