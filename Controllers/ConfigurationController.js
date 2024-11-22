const configModel = require("../Models/Configuration");

exports.GetAllConfiguration = async (req,res,next) =>{
    let configurations = await configModel.findAll();
     configurations = configurations.map((c) => c.dataValues);

    res.render("ConfigurationVIEWS/configuration-mant",{
        configurations:configurations,
        IsEmpty: configurations.length === 0,
    })
}

exports.GetEditConfiguration = async (req,res,next) =>{
   
}

exports.PostEditConfiguration = async (req,res,next) =>{
    
}
