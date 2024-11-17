const fs = require("fs");
const path = require("path")
const fileName = path.resolve(__dirname, "../config.json");

const GetConfiguration = async () =>{
    try{
        const fileData = await fs.promises.readFile(fileName, "utf8");
        return JSON.parse(fileData);
    }catch(err){
        console.log(err);
    }
  
}
const GetSingleConfigurationValue = async (key) =>{
    try{
        const fileData = await fs.promises.readFile(fileName, "utf8"); 
        
        const parcedData = JSON.parse(fileData);
        if(!(key in parcedData))
            return null;
       
        return parcedData[key];

    }catch(err){
        console.log(err);
    }
  
}

const UpdateConfiguration = async (newData) =>{
    try{
        let fileData = JSON.stringify(newData,null,2);
        await fs.promises.writeFile(fileName, fileData, "utf-8");
    }catch (err){
        console.log(err);
    }
    
}

const UpdateSingleConfigurationValue = async (key, newData) =>{
    try{
       let fileData = await exports.GetConfiguration();
       if(!(key in parcedData))
        return null;

       fileData[key] = newData;
       await exports.UpdateConfiguration(fileData);
    }catch(err){
        console.log(err);
    }
}

module.exports = {GetConfiguration, GetSingleConfigurationValue, UpdateConfiguration,UpdateSingleConfigurationValue}