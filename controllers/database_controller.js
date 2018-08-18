var mysql = require('mysql');
var configDB = require('../config/db.js');
var myClinic_db = mysql.createConnection(configDB.connection_parameters);// connect to mysql database

module.exports.CONNECT_TO_DATABASE = function(req,res){
  myClinic_db .connect(function(err){
    if (err){
       console.log('SORRY, THE SERVER IS UNABLE TO CONNECT TO THE WACSOFT SMS SERVER DATABASE!!!');
    }
    else
    {
      console.log('CONNECTED TO THE WACSOFT SMS SERVER DATABASE!!!');
      
    }
  })
}

module.exports.sd_use = myClinic_db ;