const express = require("express");
const app = express();
const {engine} = require("express-handlebars")
const path = require("path")
const connection = require("./Context/applicationContext")
const routesRegister = require("./Utils/RegisterRoutes")
const modelRelationshipConfig = require("./Utils/ModelsRelantionshipsConfig")
const seeds = require("./Utils/Seeds")
const SessionManager = require("./Utils/SessionManager");
const session = require("express-session")

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

app.use(session({secret:"anything", resave: true, saveUninitialized: false}));

app.use((req, res, next) =>{
    res.locals.IsLoggedIn = SessionManager.IsLogin(req);
    res.locals.UserInfo = SessionManager.ShowLogin(req);
    next();
});

routesRegister.Register(app)
modelRelationshipConfig.Config();

app.use(express.urlencoded({extended: false}));

app.use(function(req,res,next){
    res.status(200).send("<h1>hello world</h1>")
})
connection.sync(/*{alter:true}*/).then(() => {
    seeds.GenerateSeeds();
    app.listen(8001)
}
).catch((err) => console.log(err));