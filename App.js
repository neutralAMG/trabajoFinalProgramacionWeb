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
const {ErrorNameforFlash} = require("./Utils/ImportantENVVariables");
const User = require("./Models/User");

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
// until here


//TODO: Encapsulate this on a utils file (ConfigureSessionAndCustomizeRequests)
app.use(session({secret:"anything", resave: true, saveUninitialized: false}));

//TODO: Make success messages too
app.use(flash());

app.use(async (req, res, next)  =>{
    if(!req.session)
        return next();

    if(!req.session.user)
        return next();

    if(!req.session)
        return next();

    const User = await User.findByPk(req.session.UserInfo.id);
    req.user = User.dataValues;

    next();
})

app.use((req, res, next) =>{
    const errors = req.flash(ErrorNameforFlash)
    res.locals.IsLoggedIn = SessionManager.IsLogin(req);
    res.locals.UserInfo = SessionManager.ShowLogin(req);
    res.locals.errorMessages = errors;
    res.locals.hasErrors = errors.length > 0;
    next();
});
// until this part

routesRegister.Register(app)

modelRelationshipConfig.Config();

app.use(express.urlencoded({extended: false}));

app.use(function(req,res,next){
    res.status(200).send("<h1>hello world</h1>")
})
connection.sync({force:true}).then(() => {
    seeds.GenerateSeeds();
    app.listen(8001);
}
).catch((err) => console.log(err));