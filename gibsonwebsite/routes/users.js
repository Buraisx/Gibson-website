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

	var sql = "SELECT username, lname, fname, birth_date, gender, address, primary_phone, secondary_phone, student FROM gibson.user WHERE user_id = ?;";
	var inserts = decode.id;
	var response = {};
	sql = mysql.format(sql, inserts);

	// CREATING CONNECTION
	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("user.js: Cannot get connection to the database.");
			return done(err);
		}

		con.query(sql, function(err, results){
			if(err){
				con.release();
				console.log("user.js: Query error for finding user info");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("user.js: There is no user with this info");
				return done(new Error('No user with this info.'));
			}

			// SAVING USER INFO INTO RESPONSE OBJECT
			response.user = results[0];

			// QUERYING FOR EMERGENCY CONTACTS
			con.query('SELECT lname, fname, relationship, contact_phone FROM gibson.emergency_contact WHERE user_id = ?;', [decode.id], function(err, results){
				if(err){
					console.log('user.js: Error querying for emergency contacts.');
					return done(err);
				}

				response.emergency_contacts = results;

				if (response.user.student == 1){

					// QUERYING FOR STUDENT INFO
					con.query('SELECT school_name, grade, major, esl_level FROM gibson.student WHERE user_id = ?;', [decode.id], function(err, results){
						if(err){
							console.log('user.js: Error querying for student info.');
							return done(err);
						}

						response.student_info = results[0];

						//send info back to user
						res.render('userProfile', {title: "Sign Up", user_info: response});
					});
				}
				else{
					response.student_info = null;

					//send info back to user
					res.render('userProfile', {title: "Sign Up", user_info: response});
				}
			});
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

	// CREATING CONNECTION
	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("user.js: Cannot get connection to the database.");
			return done(err);
		}

		con.query(sql, function(err, results){
			if(err){
				con.release();
				console.log("user.js: Query error for finding user info");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("user.js: There is no user with this info");
				return done(new Error('No user with this info.'));
			}

			// SAVING USER INFO INTO RESPONSE OBJECT
			response.user = results[0];

			// QUERYING FOR EMERGENCY CONTACTS
			con.query('SELECT lname, fname, relationship, contact_phone FROM gibson.emergency_contact WHERE user_id = ?;', [decode.id], function(err, results){
				if(err){
					console.log('user.js: Error querying for emergency contacts.');
					return done(err);
				}

				response.emergency_contacts = results;

				if (response.user.student == 1){

					// QUERYING FOR STUDENT INFO
					con.query('SELECT school_name, grade, major, esl_level FROM gibson.student WHERE user_id = ?;', [decode.id], function(err, results){
						if(err){
							console.log('user.js: Error querying for student info.');
							return done(err);
						}

						response.student_info = results[0];

						//send info back to user
						res.render('userProfile', {title: "Sign Up", user_info: response});
					});
				}
				else{
					response.student_info = null;

					//send info back to user
					res.json('userProfile', {title: "Sign Up", user_info: response});
				}
			});
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
			}

			//send all course info to client
			console.log(results);
			res.json(results);
		});
	});
});


router.get('/user/profile/schedule', function(req, res) {
	console.log("Getting schedule");
	var decode = jwt.decode(req.cookies.access_token);
	var sql = "SELECT c.course_id, c.course_name, c.course_time, c.course_interval, c.course_description, c.course_days, c.end_date FROM course c INNER JOIN user_course uc ON c.course_id = uc.course_id  WHERE uc.user_id= ?;";
	var inserts = decode.id;
	sql = mysql.format(sql, inserts);

	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("cannot get connection");
			return done(err);
		}

		con.query(sql, function(err, results){
			con.release();

			if(err){
				console.log("Query error for finding user course schedule");
				return done(err);
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("userinfo for this does not exist");
			}

			//send all course info to client
			console.log(results);
			res.json(results);
		});
	});
});

//waterfall this
router.post('/user/profile/register', function(req, res,next){
	var decode = jwt.decode(req.cookies.access_token);
	console.log(decode);

	// get courseid and parse for course_id
	var course_id = Number(req.body.course_id);

	// how to compare dates?
	var query_course_exists = 'SELECT * FROM gibson.course WHERE course_id = ? AND start_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY';
	var inserts = [course_id];
	var course = {};

	connection.getConnection(function(err, con){
		if (err){
			con.release();
			console.log("cannot get connection");
			res.send(400, 'Connection Failed');
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
						res.send(400, 'Failed to query for courses.');
						return done(err);
					}

					if (!results.length) {
						console.log('No courses in database');
						// dunno what to return
						res.send(400, 'Course does not exist.');
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
						res.send(400, 'Failed to query for registered courses.');
						return done(err);
					}
					if (results.length) {
						console.log('User registered for same course already!');
						//user already registered for course
						res.send(400, 'User registered for same course already!.');
						return(new Error('User already registered for course'));
					}

					//user not in course, so register the user in the course
					var query_register = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?";
					inserts = [decode.id, course_id, 'active', 'Registered for course ID ' + course_id, course_id];
					query_register = mysql.format(query_register, inserts);

					console.log(query_register);
					con.query(query_register, function(err, reg_res){
						if (err){
							console.log('Error occured during registration query');

							con.release();
							res.send(400, 'Registration failed.');
							return done(err);
						}

						else{
							con.release();
							console.log("User ID " + decode.id + " registered for course ID " + course_id);
							res.send(200, 'Registration Complete!');
						}

					});
				});

			}]);
	});
});

router.get('/admin/profile/info', function(req, res) {
	console.log("Getting all user info");

	var decode = jwt.decode(req.cookies.access_token);
	console.log(decode);

	var sql = "SELECT fname, lname, username, email, primary_phone, secondary_phone, gender, birth_date, address, student FROM gibson.user";
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
			res.json(results);
		});
	});
});



module.exports = router;
