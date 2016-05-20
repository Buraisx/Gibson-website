var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../server_config');
var token = require('../authentication/token');
var email = require('../authentication/auto_email');
var recaptcha = require('express-recaptcha');
var sanitizer = require('sanitizer');
var async = require('async');
// CREATING CONNECTION
var connection = require('../mysqlpool');

module.exports = function(passport){


//initiate ReCaptcha
recaptcha.init('6LeqAhkTAAAAAB9OOXvWMNbFrUTNc2sTTX2rivF0','6LeqAhkTAAAAADZXG0cYZ6epZoa2Iluodu62wBqN');

//load sign up page
router.get('/signup', function(req,res,next){

	if(req.cookies.access_token){
	 	res.redirect('/user/profile');
	 }
	else
	{
		connection.getConnection(function (err, con){
			if(err){
				console.log('signup.js: Cannot Connect to database');
				res.status(500).send("Cannot Signup");
			}
			else{
				//Run Queries in Parallel
				async.parallel({
					province_list: function(next){
						var sql = "SELECT province_id, province_name FROM gibson.province;";
						con.query(sql, function (err, results){
							next(err, results);
						});
					},
					age_group_list: function(next){
						var sql = "SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group;"
						con.query(sql, function (err, results){
							next(err, results);
						});
					}	
				},
				//Return results
				function (err, results){
					//results is {province_list:values, age_group_list:values}
					con.release();
					if(err){
						console.log('signup.js: Database Query failed');
						res.status(500).send("Cannot Signup");
					}
					else{
						res.render('signup', { title: 'Sign Up', province_list: results.province_list, age_group_list: results.age_group_list, MAX: 3, captcha: recaptcha.render()});
					}
				});
			}
		});
		/*
		// MAKING THE QUERY STRING
		var sql = "SELECT province_id, province_name FROM gibson.province;";

		//query to look for the province names and the their respective province ids
		connection.getConnection(function(err, con)
		{
				con.query(sql,function(err, results)
				{
						con.release();
						//Sends Sign up Title, List of Canada Provinces, Max emergency contact
						res.render('signup', { title: 'Sign Up', province_list: results,  MAX: 3, captcha: recaptcha.render()});
				});
		});*/
	}
});

// ROUTE FOR RESENDING CONFIRMATION EMAIL
router.get('/signup/resend', function(req, res){

	var username = sanitizer.sanitize(req.query.username);

	token.resendToken(username, function(err, userInfo){
		if(err){
			res.status(err.no).send(err.msg);
		}
		else{
			email.resendSignupEmail(userInfo, function(err){
				if(err){
					res.status(err.no).send(err.msg);
				}
				else{
					res.redirect('/signup/success?username='+username);
				}
			});
		}
	});
});

// ROUTE FOR RESENDING CONFIRMATION EMAIL
router.post('/signup/resendConfirmation', function(req, res){

	var username = sanitizer.sanitize(req.body.username);

	token.resendToken(username, function(err, userInfo){
		if(err){
			res.status(err.no).send(err.msg);
		}
		else{
			email.resendSignupEmail(userInfo, function(err){
				if(err){
					res.status(err.no).send(err.msg);
				}
				else{
					res.status(200).send('Signup confirmation email sent.');
				}
			});
		}
	});
});

//create new user
router.post('/signup', function(req, res, next) {
	recaptcha.verify(req, function(err){
		if (!err){
			next();
		}
		else {
			next();
			//res.redirect('/signup');
		}
	});
}, signup_validate, passport.authenticate('local-signup', {
	session: false
}),token.generateOneUse, email.signupConfEmail , redirect);
	
	
// One-stop validation for new user signup
function signup_validate(req, res, next){
	console.log("validating");
	
	// For Loop Counter
	var i;
	
	// Double-checking for required input (Includes dropdowns)
	var required = ['username', 
					'password', 
					'email', 
					'fname', 
					'lname', 
					'age_group_id', 
					'gender', 
					'address', 
					'postal_code', 
					'city',
					'province'];
					
	var readable_required = ['Username',
							'Password',
							'E-mail', 
							'First name', 
							'Last name', 
							'Age Group',
							'Gender', 
							'Address', 
							'Postal Code', 
							'City', 
							'Province'];
					
	for (i = 0; i < required.length; i++){
		if (!req.body[required[i]] || req.body[required[i]] == ""){
			console.log(required[i] + " has no value entered / selected");
			res.status(400).send(readable_required[i] + " has no value entered / selected");
			return new Error(readable_required[i] + " has no value entered / selected");
		}
	}
	
	// If student check the relevant required fields
	// IDK how to test regex against school name
	if (req.body.student){
		if (req.body.schoolname == ""){
			console.log("School name has no value entered");
			res.status(400).send("School name has no value entered / selected");
			return new Error("School name has no value entered / selected");
		}
		if (req.body.grade == ""){
			console.log("Grade has no value entered / selected");
			res.status(400).send("Grade has no value entered / selected");
			return new Error("Grade has no value entered / selected");
		}
	}
	
	// Check Emergency contact: first one must be complete
	// Not doing regex checks
	if (!(req.body.emergencyfname1 && req.body.emergencylname1 && relationship1 && req.body.ephone1 && req.body.ephoneextension1)){
		console.log("First emergency contact info incomplete");
		res.status(400).send("Complete the first emergency contact's information");
		return new Error("Complete the first emergency contact's information");
	}
	// second and third must be complete only if at least 1 field is filled
	// i.e. If there's at least 1 field filled, then warn to complete the rest
	if (!(req.body.emergencyfname2 || req.body.emergencylname2 || relationship2 || req.body.ephone2 || req.body.ephoneextension2)){
		if (!(req.body.emergencyfname2 && req.body.emergencylname2 && relationship2 && req.body.ephone2 && req.body.ephoneextension2)){
			console.log("Emergency contact 2's info is incomplete");
			res.status(400).send("Emergency contact 2's info is incomplete");
			return new Error("Emergency contact 2's info is incomplete");
		}
	}
	
	if (!(req.body.emergencyfname3 || req.body.emergencylname3 || relationship3 || req.body.ephone3 || req.body.ephoneextension3)){
		if (!(req.body.emergencyfname3 && req.body.emergencylname3 && relationship3 && req.body.ephone3 && req.body.ephoneextension3)){
			console.log("Emergency contact 3's info is incomplete");
			res.status(400).send("Emergency contact 3's info is incomplete");
			return new Error("Emergency contact 3's info is incomplete");
		}
	}
	

	// Check username, e-mail, postal code against regex 
	var usernameRegex = new RegExp(/^(\w{3,16})$/);
	var emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	var pcodeRegex = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
	
	//if (req.body.username.length < 3 || req.body.username.length > 16){
	if (!usernameRegex.test(req.body.username)){
		console.log("Bad username" + req.body.username);
		res.status(400).send("Username should be between 3 to 16 characters long");
		return;
	}
	
	if (!emailRegex.test(req.body.email)){
		console.log("Bad E-mail");
		res.status(400).send("Bad E-mail format");
		return;
	}

	if (!pcodeRegex.test(req.body.postal_code)){
		console.log("Bad postal code");
		res.status(400).send("Bad Postal Code format");
		return;
	}
	
	// Checking username and e-mail not taken (double-checking)
	connection.getConnection(function(err, con){
		if (err){
			console.log("signup.js: signup_validate cannot get connection");
			con.release();
			return err;
		}
		var sql = "SELECT COUNT(*) AS count FROM gibson.user WHERE username = ?";
		var inserts = req.body.username;
		
		con.query(mysql.format(sql, inserts), function(err, numUsers){
			if (err){
			console.log("signup.js: signup_validation failed to query for username check");
			con.release();
			return err;
			}
			if (numUsers[0].count) {
				console.log("Username already taken");
				res.status(400).send("Username already taken");
				return new Error("Username already taken");
			}
			else {
				// Only check e-mail if username is ok
				sql = "SELECT COUNT (*) AS count FROM gibson.user WHERE email = ?";
				inserts = req.body.email;
				
				con.query(mysql.format(sql, inserts), function(err, numEmail){
					if (err){
						console.log("signup.js: signup_validation failed to query for email check");
						con.release();
						return err;
					}
					if (numEmail[0].count){
						console.log("E-mail associated with another account");
						res.status(400).send("E-mail associated with another account");
						return new Error("E-mail associated with another account");
					}
				});
			}
		});
		con.release();
	});
	
	next();
}

// REDIRECT FOR SIGNUP PAGE
function redirect(req, res){
	res.status(200).send({redirect_url: 'signup/success?username='+req.user.username});
}

//show signup success page
router.get('/signup/success', function(req, res){
	res.render('SuccessSignup', {title: 'Success Sign Up!', username: req.query.username});
});

// ==============================================================
// ↓↓↓↓↓Intermediate post requests↓↓↓↓↓
// ==============================================================
//Check Available Username
router.post('/signup/username', function(req, res, next){
	var sql = "SELECT COUNT(*) AS count FROM gibson.user WHERE username = ?";
	var inserts = [req.body.username];

	connection.getConnection(function (err, con){
		con.query(mysql.format(sql, inserts), function(err, results){
			con.release();
			if(err){
				res.status(500).send();
			}

			else{

				if(results[0].count == 0){
					res.status(200).send(true);
				}
				else{
					res.status(200).send(false);
				}

			}
		});
	});
});

//Check Available email
router.post('/signup/email', function(req, res, next){
	var sql = "SELECT COUNT(*) as count FROM gibson.user WHERE email = ?";
	var inserts = [req.body.email];

	connection.getConnection(function (err, con){
		con.query(mysql.format(sql, inserts), function(err, results){
			con.release();
			if(err){
				res.status(500).send();
			}

			else{

				if(results[0].count == 0){
					res.status(200).send(true);
				}
				else{
					res.status(200).send(false);
				}

			}
		});
	});
});



	return router;
};
