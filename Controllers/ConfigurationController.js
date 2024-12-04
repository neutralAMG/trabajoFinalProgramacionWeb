const configModel = require("../Models/Configuration");
const {UIMessagesNamesForFlash} = require("../Utils/ImportantENVVariables");
exports.GetAllConfiguration = async (req,res,next) =>{
    try {
        let configurations = await configModel.findAll();
        configurations = configurations.map((c) => c.dataValues);
        configurations.map((c) => {
           c.Value =(Number(c.Value) * 100)
           return c;
        })
       res.render("ConfigurationViews/configuration-mant",{
           configurations:configurations,
           IsEmpty: configurations.length === 0,
       })
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.GetEditConfiguration = async (req,res,next) =>{
    try {
        const id = req.params.id
        const configuration = await configModel.findByPk(id);
        configuration.dataValues.Value = (Number(configuration.dataValues.Value) * 100)
        res.render("ConfigurationViews/configuration-edit",{
         configuration: configuration,
        })
    } catch (err) {
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("back");
    }
}

exports.PostEditConfiguration = async (req,res,next) =>{
    try{
        const {Id,config} = req.body;
        await configModel.update({
            Value: (config /100)
        },{where:{Id:Id}});

        req.flash(UIMessagesNamesForFlash.SuccessMessageName,  "The configuration has been updated succesfully");
        res.redirect("/configuration/configuration-index")
    }catch (err){
        req.flash(UIMessagesNamesForFlash.ErrorMessageName, "Error while processing the request");
        console.error(err);
        res.redirect("/configuration/configuration-index");
    }
    
}
