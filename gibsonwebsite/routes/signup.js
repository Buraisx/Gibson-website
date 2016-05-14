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
} ,passport.authenticate('local-signup', {
	session: false
}),token.generateOneUse, email.signupConfEmail , redirect);

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
