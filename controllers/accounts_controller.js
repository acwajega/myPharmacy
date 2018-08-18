var db_controller = require('../controllers/database_controller.js');   

var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
var url = require('url');
//----------------------------Loging into the eSente----------------------------



//-------------------------------CREATING NEW CLINIC ACCOUNT----------------
module.exports.CreateNewClinicAccount = function(req,res){
   	var newAccountDetails = req.body;//-----------Getting the new Account details

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
	


//----cheking if the admin account provided is valid
qry_action.query('select * from admin_users where au_username = ? and au_password = ? ',
	[newAccountDetails.admin_username,newAccountDetails.admin_password],function(err,results){


	if (err){
			 res.end(JSON.stringify({ resp:"err",err: 'An error occured while executing the querry' }));
			 
		}
		else
		{
			

				if (results.length === 0){
					//-----------The Access Code is Not Valid
					res.end(JSON.stringify({ resp:"err",err: 'Sorry the Admin User Account provided is not Valid' }));
					
			}
			else
			{
			
		
				var user_account = results[0].AU_ID; 


			
				var hat = require('hat');
				
                var access_code = hat().substring(0,4)+mdate.substring(0,3) ;
               
                //------------------------CHECKING IF THE CLINIC ACCOUNT HAS ALREADY BEEN CREATED-------
                qry_action.query('select * from mcm_clients_info where MCI_NAME = ? ',[newAccountDetails.clinic_name],function(err,results){
					if (err)
					{
						
						

					}
					else
					{
						
						
						if (results.length === 0){
						
							//-------------Clinic is New------
									//------------------------inserting into mcm_clients_info
				qry_action.query('insert into mcm_clients_info set ?  ',{MCI_NAME:newAccountDetails.clinic_name,
					MCM_LOCATION:newAccountDetails.clinic_address,MCI_MOB_TEL:newAccountDetails.clinic_tel,MCI_EMAIL:newAccountDetails.
					clinic_email,MCI_ACCESS_CODE:access_code,MCI_STAFF_ID:user_account},function(err,results){


					if (err){
						
						throw err;
					return   res.end(JSON.stringify({ resp:"err",err: 'Sorry, An error occured while creating this account' }));
					
				}
				else
				{
				
					return   res.end(JSON.stringify({ resp:"pass",access_code: access_code }));


				}
				});
				//---------------------------Inserting int the mcm_clients_info Table------------------
						}
						else
						{
							
							return   res.end(JSON.stringify({ resp:"err",err: 'Sorry, An exisiting account for this clinic is already created' }));


						} 

					}

				});


                //--------------------------END OF CHECKING IF THE CLINIC ACCOUNT HAS BEEN CREATED----

		






			}

		}

});


}


//--------------------------END OF CREATING NEW CLINIC ACCOUNT--------












//---------------------------------CREATING NEW User ACCOUNTS------------------------------
module.exports.CreateNewUserAccount = function(req,res){
	var newAccountDetails = req.body;//-----------Getting the new Account details

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
	


//---------------------Checking if the mcm_access_code is valid---------
qry_action.query('select * from mcm_clients_info where MCI_ACCESS_CODE = ? ',
	[newAccountDetails.mci_access_code], 
	function(err,results){
		console.log('1');
	if (err){
		 console.log('2');
			 res.end(JSON.stringify({ resp:"err",err: 'An error occured while executing the querry' }));
		}
		else
		{
			console.log('3');
			if (results.length === 0){
				console.log('4');
					//-----------The Access Code is Not Valid
					res.end(JSON.stringify({ resp:"err",err: 'Sorry the Clinic Access Code provided is not Valid' }));

			}
			else
			{
				console.log('5');
				//-------------Clinic access code is valid----
				qry_action.query('select * from users_info where ui_username = ? and ui_password = ? and ui_mci_access_code = ? ',
	[newAccountDetails.username,newAccountDetails.password,newAccountDetails.mci_access_code],
	function(err,results){
		console.log('6');
		//----if an error occurs on executing this sql statement
		if (err){
			console.log('7');
			 res.end(JSON.stringify({ resp:"err",err: 'An error occured while executing the querry' }));
		}
		else
		{
           console.log('8');
		}

		//------------if the account is new 
		if (results.length === 0){
			//-------------Create the new Account-----
console.log('8');
			qry_action.query('insert into users_info set ? ',{UI_SURNAME:newAccountDetails.surname,
				UI_OTHERNAMES :newAccountDetails.othernames,UI_MOB_TEL:newAccountDetails.mob_tel,UI_USERNAME:newAccountDetails.username,
				UI_PASSWORD :newAccountDetails.password,UI_MCI_ACCESS_CODE :newAccountDetails.mci_access_code},
				function(err,result){

				//-----if an error occured
				if (err){
					console.log('10');
					return   res.end(JSON.stringify({ resp:"err",err: 'Sorry, An error occured while creating this account' }));

				}
				else
				{
					console.log('11');
					return   res.end(JSON.stringify({ resp:"pass",err: 'Account Successfully Created!!!' }));


				}


			});




		}
		else
		{
			console.log('12');
			//------------ if the Account is already in the system
			return   res.end(JSON.stringify({ resp:"err",err: 'Sorry, There is an existing account for this particular access code with the same account ID!!' }));

		}


});


			}



		}


});









}

//------------------------------------------END OF CREATING NEW USER ACCOUNT




//----------------------------Creating New Clinic Accounts---------------------------



//----------------------------End Of Creating New Clinic Acconuts------------------