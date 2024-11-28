const configModel = require("../Models/Configuration");

exports.GetAllConfiguration = async (req,res,next) =>{
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
}

exports.GetEditConfiguration = async (req,res,next) =>{
   const id = req.params.id
   const configuration = await configModel.findByPk(id);
   configuration.dataValues.Value = (Number(configuration.dataValues.Value) * 100)
   res.render("ConfigurationViews/configuration-edit",{
    configuration: configuration,
   })
}

exports.PostEditConfiguration = async (req,res,next) =>{
    try{
        const {Id,config} = req.body;
        await configModel.update({
            Value: (config /100)
        },{where:{Id:Id}});

        res.redirect("/configuration/configuration-index")
    }catch (err){
      console.error(err);
    }
    
}
