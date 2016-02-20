var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../server_config');


module.exports = function(passport){

//load sign up page
router.get('/signup', function(req,res,next){
	// CREATING CONNECTION
	var connection = mysql.createPool(config.db_config);

	// MAKING THE QUERY STRING
	var sql = "SELECT province_id, province_name FROM gibson.province;";

	//query to look for the user with serialized username
	connection.getConnection(function(err, con)
	{
			con.query(sql,function(err, results)
			{
					con.release();
					console.log(JSON.stringify(results));
					console.log(results);
					res.render('signup', { title: 'Sign Up', province_list: results});
			});
	});
});

//create new user
router.post('/signup',  passport.authenticate('local-signup', {
	successRedirect: '/signup/success',		// Redirect to main page when login complete
	failureRedirect: '/lol',	// Return to login when fail, and flash error
	failureFlash: true
	})
);

//show signup success page
router.get('/signup/success', function(req,res){
	res.render('SuccessSignup', {title: 'Success Sign Up!', token:'ckveriovkxjfiekdjikcvjdifkxkj'});
});

	return router;
};
