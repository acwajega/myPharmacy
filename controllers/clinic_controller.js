var db_controller = require('../controllers/database_controller.js');   

var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
var url = require('url');
//----------------------------Loging into the eSente-------------------------



//--------------------------Uploading  Clinic Daily income
module.exports.UploadClinicDailyIncome = function(req,res){
		var UploadDetails = req.body;//-----------Getting the new Account details
		console.log(req.body);
		var _=require("underscore");

		console.log(UploadDetails);
		var jsonObject=JSON.parse(JSON.stringify(UploadDetails));

		//--------------------Going through all the rows of json objects
		_.each(jsonObject, function(data_obj) {

			//----------------Getting a row object
			 var row =JSON.parse(JSON.stringify(data_obj));
			 //------------Checking if data has already been uploaded------------
			 qry_action.query('SELECT * FROM daily_incomes WHERE di_date = ? and di_mci_code =?',[row.DI_DATE,row.DI_MCI_CODE] , function(err, result) {
			 	
			 	//-------------If there is an error with the query
			 	if (err) throw err;

			 	//------------if there is no error
			 	//---------------If no data has been entred-----------
			 	if (result.length ==0){

			 		 qry_action.query('insert into daily_incomes set ?',row, function(err, result) {
                          if (err) throw err;
    
                       console.log(result.insertId);
                             });



			 	}

			 	//--------------If data has been uploaded
			 	else
			 	{
			 		 qry_action.query('update daily_incomes set DI_TOTAL_AMOUNT = ?,DI_AMOUNT_PAID =?,DI_AMOUNT_NOT_PAID =?,DI_EXPENSE =? where di_date =?',[row.DI_TOTAL_AMOUNT,row.DI_AMOUNT_PAID,row.DI_AMOUNT_NOT_PAID,row.EXPENSE,row.DI_DATE] , function(err, result) {
                   if (err) throw err ;
    
                  console.log(result.insertId);
                     });
 
			 	}





			 });





		});


return   res.end(JSON.stringify({ resp:"pass",msg:'Daily Income Upload Successfull'}));

}
//-----------------------End of Uploading Clinic Daily Income







//--------------------------Synching  Clinic Daily income
module.exports.SyncClinicDailyIncome = function(req,res){

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

		if (results.length ==0){
			res.end(JSON.stringify({ resp:"err",err: 'You do not have access to the myClinic Server!!' }));
		}
		else
		{
			var user_id = results[0].UI_ID;
		
			//-----------------Geting the record-----------------------------

			qry_action.query('select * from daily_incomes where di_mci_code =? and di_sync_status =?',
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
   
          var trans_record = results[i];  
 		     var trans_obj = JSON.parse(JSON.stringify(trans_record));
               
               //updating the sync status 
               qry_action.query('UPDATE daily_incomes SET  di_sync_status =? where di_id =?',['Y',trans_obj.DI_ID], function (err, results){
               if (err){
               
               throw(err);
               }
               else
               {
               
               
               }
               
               
               
               
               
               });
               
               
               
 
 		}
  
   res.end(JSON.stringify(results));

   }



   }





    });



		}



	});





	}

//---------------------------------End of Synching Clinic Daily Income