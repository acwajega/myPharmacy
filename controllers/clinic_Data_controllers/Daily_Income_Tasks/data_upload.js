		var path = require("path"),
		fs = require("fs");
		//fs.readFile(path.join(__dirname, '../..', 'foo.bar'))

		//var db_controller = require('../controllers/database_controller.js');  
		var db_controller = require(path.normalize(__dirname + "/../../database_controller.js"));  


		var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
		var url = require('url');
		//----------------------------Loging into the eSente-------------------------


		//--------------------------Uploading  Clinic Daily income
		module.exports.Upload = function(req,res){

		    console.log('reached hia');
			var UploadDetails = req.body;//-----------Getting the new Account details

			var _=require("underscore");

			console.log(UploadDetails);
			var jsonObject=JSON.parse(JSON.stringify(UploadDetails));
			var count = 0;

			//--------------------Going through all the rows of json objects


			_.each(jsonObject, async function(data_obj) {


                console.log('------------------------------');
                count =count+1;
				console.log('Record COUNR----'+count);

				//----------------Getting a row object
				 var row =JSON.parse(JSON.stringify(data_obj));


				 		//---------------------UPDATING DAILY INCOMES PROMISE----------------
					 		let upDateDailyIncome = function(){

					 	
					 						 qry_action.query('update daily_incomes set DI_TOTAL_AMOUNT = ?,DI_TOTAL_CLIENTS =?,DI_TOTAL_PROFIT =?,DI_TOTAL_EXPENSE =?,DI_NET_REVENUE =?,DI_SYNC_STATUS = ?,DI_UNITS_SOLD =? where di_date =? and di_mci_code =?',
					 						 	[row.DI_TOTAL_AMOUNT,row.DI_TOTAL_CLIENTS,row.DI_TOTAL_PROFIT,row.DI_TOTAL_EXPENSE,row.DI_NET_REVENUE,'N',row.DI_UNITS_SOLD,row.DI_DATE,row.DI_MCI_CODE] , function(err, results) {
			               if (err) {
			               	reject('error executing the query');


			               } 
								else
					 					{
					 						

					 					}
			                 });

					 		

					 		}

				 		//---------------------END OF UPDATING DAILY INCOMES PROMISE







				  //--------------------Insert into Daily INcomes promise
				 		let insertIntoDailyIncomes = function(){
			
				 				qry_action.query('insert into daily_incomes set ?',row,function(err,results){

				 					if (err){
				 					

				 					}
				 					else
				 					{
				 					
				 						console.log('Inserted DAILY_INCOMES TABLE id----'+count);

				 					}

				 				});


				 		}
				 		//------------------------End on Inserting ino Daily Incomes Proise




				 //-----------------------------------Check if record has been entred Promise--------
				 let checkIfRecordHasBeenEntred = function(){

				 		//------------Checking if data has already been uploaded------------
				 qry_action.query('SELECT * FROM daily_incomes WHERE di_date = ? and di_mci_code =?',[row.DI_DATE,row.DI_MCI_CODE] , function(err, results) {
				 	
				 	//-------------If there is an error with the query
				 	if (err) throw err;

				 	//------------if there is no error
				 	//---------------If no data has been entred-----------
				 	if (results.length === 0){
				 		insertIntoDailyIncomes();//---insert into the table
				 		InsertIntoDailyIncomesUserSyncTable();

				 		

				 	}//----end of if

				 	//--------------If data has been uploaded
				 	else
				 	{
				 		upDateDailyIncome();//---------UPDATE
				 		InsertIntoDailyIncomesUserSyncTable();

				 		
				 	}


				 });


				 //--------------------------------------END OF CHECK----------------------------------------------------------------



				 }

				  //--------------End of Check if record has been entred Promise--------

				



				 		//---------------------GOING TO PERFORM THE TRAIN FUNCTIONALITY

				 checkIfRecordHasBeenEntred();
				 		


	 });



//------------------------------INSERTING INTO THE DAILY_INCOMES_USER_SYNC_TABLE PROMISE---------

				 		let InsertIntoDailyIncomesUserSyncTable = function(){
				 		
				 				qry_action.query('select * from daily_incomes where di_sync_status = ?  ',['N'],function(err,results){

				 					if (err){
				 						throw err;
				 					}
				 					else
				 					{

				 					
				 				for (var i = 0; i < results.length; i++){

				 					var dailyIncomeRow = results[i];

				 					(function(rowM) {
				 						

				 				//---------Getting all the users with the same access code------
				 				qry_action.query('select * from users_info where ui_mci_access_code = ?',rowM.DI_MCI_CODE,function(err,results){
				 					if (err){
				 					

				 					}
				 					else
				 					{
				 					
				 						for (var i = 0; i < results.length; i++){
				 							var userRow = results[i];
				 							 (function(row) {

				 							
				 							qry_action.query('insert into daily_income_user_sync set ?',{DIUS_UI_ID :row.UI_ID,DIUS_DI_ID:rowM.DI_ID },function(err,result){

				 								if (err){
				 									

				 								}
				 								else
				 								{
				 								
				 									

				 								}

				 							});


				 							//------------------Updating the sync status------
				 							qry_action.query('update daily_incomes set di_sync_status = ? where di_id = ?',['Y',rowM.DI_ID],function(err,result){

				 								if (err){
				 									

				 								}
				 								else
				 								{
				 								
				 									

				 								}

				 							});

				 							//-------------------End of Updating sync sttaus

				 							})(userRow);


				 						}//-----End of For Loop

				 					}


				 				});

				 				//------------------End of Getting users with the same acess cod
				 							


				 						})(dailyIncomeRow);
				 						}//---------------End of For loop

				 					}


				 				});


				 		}
//------------------------------END OF INSERTING INTO THE DAILY_INCOMES_USER_SYNC_TABLE PROMISE---------

InsertIntoDailyIncomesUserSyncTable();




return   res.end(JSON.stringify({ resp:"pass",msg:'Daily Income Upload Successfull'}));



		}
		//-----------------------End of Uploading Clinic Daily Income
