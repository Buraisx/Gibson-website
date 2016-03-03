var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = mysql.createPool(config.db_config);
var async = require('async');

/* GET users listing. */
router.get('/user/profile', function(req, res, next) {
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
			con.release();

			if(err){
				console.log("Query error for finding user info");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("There is no user with this info");
				return done(new Error('No user with this info.'));
			}

			//send info back to user
			res.render('userProfile', {title: "Sign Up", user_info: results});
		});
	});
  

});

router.get('/user/profile/info', function(req, res) {
	console.log("Getting user info");

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
			con.release();

			if(err){
				console.log("Query error for finding user info");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("No User");
				return done(new Error('No user exist.'));
			}

			//send all course info to client
			console.log(results);
			res.json(results);
		});
	});
});

router.get('/user/profile/courses', function(req, res) {
	console.log("Getting registered courses");

	var sql = "SELECT course_id, course_name, default_fee, start_date, end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course ORDER BY course_id DESC";
	console.log(sql);

	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("cannot get connection");
			return done(err);
		}
		
		con.query(sql, function(err, results){
			con.release();

			if(err){
				console.log("Query error for finding courses");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("No courses");
				return done(new Error('No courses exist.'));
			}

			//send all course info to client
			console.log(results);
			res.json(results);
		});
	});
});

//waterfall this
router.post('/user/profile/register', function(req, res, next){
	var decode = jwt.decode(req.cookies.access_token);
	console.log(decode);
	
	// get courseid and parse for course_id
	var course_id = Number(req.body.course_id);
	
	// how to compare dates? 
	var query_course_exists = 'SELECT * FROM gibson.course WHERE course_id = ? AND start_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY';
	var inserts = [course_id];
	var course = {};
	var regError = null;
	var regRes = false;
	

	connection.getConnection(function(err, con){
		if (err){
			con.release();
			console.log("cannot get connection");
			return done(err);
		}
		async.waterfall([
			function(next){
				query_course_exists = mysql.format(query_course_exists, inserts);

				console.log(query_course_exists);
				con.query(query_course_exists, function(err, results){
					if (err)
					{
						//con.release(); // uncomment if ok to release after 1 error
						console.log('Failed to query for courses');
						regError = err;
						return done(err);
					}
			
					if (!results.length) {
						console.log('No courses in database');
						// dunno what to return
						return done(null, null);
					}
			
				course = results[0];
				});
				next(null, course);
			}, 
			function(course, next){
				var query_not_already_registered = 'SELECT user_id, course_id FROM gibson.user_course WHERE user_id = ? AND course_id = ?';
				inserts = [decode.id, course_id];
				query_not_already_registered = mysql.format(query_not_already_registered, inserts);
			
				console.log(query_not_already_registered);
				con.query(query_not_already_registered, function(err, results) {
					if (err) {
						console.log('Failed to query for registered courses');
						regError = err;
						return done(err);
					}
					if (results.length) {
						console.log('User registered for same course already!');
						// dunno what to return
						next(new Error('User already registered for course'), null);
					}
				});
				next(null, course);
			}], 
			function (err, course){
				if (err) {
					console.log('Failed to register');
					con.release();
					regError = err;
					return done(err);
				}
				
				var query_register = "INSERT INTO user_course values (DEFAULT, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)";
				inserts = [decode.id, course_id, course.default_fee, course.default_fee, 0, course.start_date, course.end_date, 'IDK', 'Registered for course ID ' + course_id];
				query_register = mysql.format(query_register, inserts);
				
				console.log(query_register);
				con.query(query_register, function(err, reg_res){
					if (err){
						console.log('Error occured during registration query');
						regError = err;
						con.release();
						return done(err);
					}

					else{
						con.release();
						console.log("User ID " + decode.id + " registered for course ID " + course_id);
						regRes = true;
					}
				});
			}
		);
	});
	res.status(regError).send(regRes);
});


module.exports = router;
