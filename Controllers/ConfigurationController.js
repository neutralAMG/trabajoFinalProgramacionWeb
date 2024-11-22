const configModel = require("../Models/Configuration");

exports.GetAllConfiguration = async (req,res,next) =>{
    let configurations = await configModel.findAll();
     configurations = configurations.map((c) => c.dataValues);

    res.render("ConfigurationViews/configuration-mant",{
        configurations:configurations,
        IsEmpty: configurations.length === 0,
    })
}

exports.GetEditConfiguration = async (req,res,next) =>{
   const id = req.params.id
   const configuration = await configModel.findByPk(id);

   res.render("ConfigurationViews/configuration-edit",{
    configuration: (Number(configuration.dataValues) * 100),
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
