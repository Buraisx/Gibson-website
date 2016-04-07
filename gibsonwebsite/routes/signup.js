var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../server_config');
var token = require('../authentication/token');
var email = require('../authentication/auto_email');
var recaptcha = require('express-recaptcha');
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
		});
	}
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
	session: false,
	failureFlash: true
}),token.generateOneUse, email.signupConfEmail , redirect);

// REDIRECT FOR SIGNUP PAGE
function redirect(req, res){
	res.redirect('/signup/success');
}

//show signup success page
router.get('/signup/success', function(req,res){
	res.render('SuccessSignup', {title: 'Success Sign Up!'});
});

// ==============================================================
// ↓↓↓↓↓Intermediate post requests↓↓↓↓↓
// ==============================================================
//Check Available Username
router.post('/signup/username', function(req, res, next){
	var sql = "SELECT COUNT(*) FROM gibson.user WHERE username = ?";
	var inserts = [req.body.username];

	connection.getConnection(function (err, con){
		con.query(mysql.format(sql, inserts), function(err, results){
			if(err){
				res.send(401);
				return err;
			}

			else{
				console.log(results);
				res.send(results);
			}
		});
	});
});

//Check Available email
router.post('/signup/email', function(req, res, next){
	var sql = "SELECT COUNT(*) FROM gibson.user WHERE email = ?";
	var inserts = [req.body.email];

	connection.getConnection(function (err, con){
		con.query(mysql.format(sql, inserts), function(err, results){
			if(err){
				res.send(401);
				return err;
			}

			else{
				console.log(results);
				res.send(results);
			}
		});
	});
});



	return router;
};

