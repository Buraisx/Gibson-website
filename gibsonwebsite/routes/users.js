var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = mysql.createPool(config.db_config);

/* GET users listing. */
router.get('/user/profile', function(req, res, next) {
	console.log("funkemessage");
	var decode = jwt.decode(req.cookies.access_token);
	console.log(decode);

	var sql = "SELECT fname, lname, username, email, primary_phone, secondary_phone, gender, birth_date, address, student FROM gibson.user WHERE user_id = ?";
	var inserts = decode.id;
	sql = mysql.format(sql, inserts);
	console.log(sql);

	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("cannot get connection");
			return done(err);
		}
		
		con.query(sql, function(err, results){

			if(err){

				con.release();
				console.log("Query error for finding user info");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				con.release();
				console.log("There is no user with this info");
				return done(new Error('No user with this info.'));
			}

			//send info back to user
			res.render('userProfile', {title: "Sign Up", user_info: results});
		});
	});
  

});

router.get('/user/profile/courses', function(req, res) {
	console.log("Getting registered courses");
	res.json({msg: 'this is a message', pkg: [1, 2, 3 ,4 ,5]});
});


module.exports = router;
