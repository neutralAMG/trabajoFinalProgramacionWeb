const express = require("express");
const app = express();
const {engine} = require("express-handlebars")
const path = require("path")
const connection = require("./Context/applicationContext")
const routesRegister = require("./Utils/RegisterRoutes")
const modelRelationshipConfig = require("./Utils/ModelsRelantionshipsConfig")
const seeds = require("./Utils/Seeds")
const SessionManager = require("./Utils/SessionManager");
const session = require("express-session");
const flash = require("connect-flash");
const {ErrorNameforFlash, Roles,OrderStatus} = require("./Utils/ImportantENVVariables");
const User = require("./Models/User");
const multer = require("multer");
const {v4: uuidv4} = require("uuid")
const csurf = require("csurf");

// TODO: Encapsulate this part on a utils file (ConfigureEngine)
app.engine("hbs", engine({
    helpers:{
        equals: (item1,item2) => item1 === item2,
    },
    layoutsDir: "Views/Layouts",
    defaultLayout:"main-layout",
    extname: "hbs",
}));

app.set("view engine", "hbs");
app.set("views", "views")
app.use(express.static(path.join(__dirname,"Public")));

app.use("/Images",express.static(path.join(__dirname,"Images")));

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "Images")
    },
    filename: (req, file, cb) =>{
        cb(null, `${uuidv4()}-${file.originalname}`)
    }
});
app.use(multer({storage: imageStorage}).single("Image"));
// until here


//TODO: Encapsulate this on a utils file (ConfigureSessionAndCustomizeRequests)
app.use(session({secret:"anything", resave: false, saveUninitialized: false,cookie:{
    maxAge: 30 * 24 * 60 * 60 * 1000,
}}));

app.use(express.urlencoded({extended: false}));
//TODO: Make success messages too

// app.use(csurf());
app.use(flash());

app.use(async (req, res, next)  =>{
    
    if(!req.session )
        return next();

    if(!req.session.user)
        return next();
    console.log(req.session.UserInfo.Id);
    
    const User = await User.findByPk(req.session.UserInfo.Id);
    req.user = User;

    next();
})

app.use((req, res, next) =>{
    const errors = req.flash(ErrorNameforFlash);
    res.locals.IsLoggedIn = SessionManager.IsLogin(req);
    res.locals.UserInfo = SessionManager.ShowLogin(req);
    res.locals.errorMessages = errors;
    res.locals.roles = Roles;
    res.locals.orderStatus = OrderStatus;
    res.locals.hasErrors = errors.length > 0;
    // res.locals.csrfToken = req.csrfToken();
    next();
});
// until this part

routesRegister.Register(app)

modelRelationshipConfig.Config();

app.use(function(req,res,next){
    if(res.locals.IsLoggedIn){ return res.status(400).send("<h1 class='text-center display-1 mt-5' >404</h1>");}
        
    res.redirect("/account/authenticate");
})
connection.sync(/*{alter:true}*/).then(() => {
    seeds.GenerateSeeds();
    app.listen(8001);
}
).catch((err) => console.log(err));