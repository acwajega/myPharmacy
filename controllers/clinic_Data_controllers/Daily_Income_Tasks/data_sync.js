var path = require("path"),
    fs = require("fs");
    //fs.readFile(path.join(__dirname, '../..', 'foo.bar'))

//var db_controller = require('../controllers/database_controller.js');  
var db_controller = require(path.normalize(__dirname + "/../../database_controller.js"));  
var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
var url = require('url');
//----------------------------Loging into the eSente-------------------------



//--------------------------Synching  Clinic Daily income
module.exports.Sync = function(req,res){

var reqDetails = req.body;//-----------Getting the new Account details

//-----Getting the request Ip 
var ip = req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
//---------------End of Getting the request ip

//-------------Getting the request datae and time
var d = new Date(); 
var mdate = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate() ;

var time = new Date();
var m_time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
//-------------End of Getting the request date and time
	

	//----------------------Checking if the provided access details from the user are valid------
	qry_action.query('select * from users_info where ui_username = ? and ui_password = ? and ui_mci_access_code = ?',[reqDetails.username,reqDetails.password,reqDetails.accessCode],function(err,results){

		if (err) throw err;

		if (results.length ===0){
			res.end(JSON.stringify({ resp:"err",err: 'You do not have access to the myClinic Server!!' }));
		}
		else
		{
			var user_id = results[0].UI_ID;
		
			//-----------------Geting the record-----------------------------

			qry_action.query('select A.*,B.* from daily_incomes A join daily_income_user_sync B on A.di_id = B.dius_di_id where A.di_mci_code =? and B.dius_sync_status =?',
    [reqDetails.accessCode,'N'], function (err, results){
    	   if (err){
   
   throw(err);
   
   }

   else
   {
   		 //-------is there is no data
   if (results.length ===0){
   
   
    res.end(JSON.stringify([]));
   
   
   }

   else
   {
   	//-----------There is data--------
   	 //------Updating the sync status
   for (var i = 0; i < results.length; i++){

    var dataRow = results[i];

     (function(rowM) {

   
           
   
         // var trans_record = results[i];  
 		    // var trans_obj = JSON.parse(JSON.stringify(trans_record));
               
               //updating the sync status 
               qry_action.query('UPDATE daily_income_user_sync SET  dius_sync_status =? where dius_id =?',['Y',rowM.DIUS_ID], function (err, results){
               if (err){
               
               throw(err);
               }
               else
               {
               
               
               }
               
               
               
               
               
               });
               })(dataRow);
               
               
               
 
 		}
  
   res.end(JSON.stringify(results));

   }



   }





    });



		}



	});





	}

//---------------------------------End of Synching Clinic Daily Income