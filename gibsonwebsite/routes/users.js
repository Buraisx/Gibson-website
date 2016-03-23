var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');

/* GET users listing. */
router.get('/user/profile', function(req, res, next) {
	//send info back to user
	res.render('userProfile', {title: "Your Profile"}, function(err, html){
		res.send(html);
	});
});

router.get('/user/profile/info', function(req, res, next) {
	var decode = jwt.decode(req.cookies.access_token);
	var response = {};

	connection.getConnection(function(err, con){
		if(err){
			connection.end();
			console.log("user.js: Cannot get connection to the database.");
			return err;
		}

		else{
			async.waterfall([
				function(next){
					var sql = "SELECT username, lname, fname, birth_date, gender, email, address, primary_phone, secondary_phone, student FROM gibson.user WHERE user_id = ?;";
					var inserts = decode.id;
			
					sql = mysql.format(sql, inserts);
					con.query(sql, function(err, results){
						if(err){
							console.log("Cannot query for user info.");
							return next(err);
						}

						else if(!results.length){
							console.log("No user found.");
							return (new Error("No user found."));

						}

						else{
							response.user = results[0];
							next(null);
						}
					});
				},

				function(next){
					var sql = 'SELECT lname, fname, relationship, contact_phone FROM gibson.emergency_contact WHERE user_id = ?;';
					var inserts = decode.id;

					sql = mysql.format(sql, inserts);
					con.query(sql, function(err, results){
						if(err){
							console.log("Cannot query for emergency contacts.");
							return next(err);
						}

						else if(!results.length){
							console.log("No contacts found.");
						}

						response.emergency_contacts = results;
						next(null);
					});
				},

				function(next){
					var sql = 'SELECT school_name, grade, major, esl_level FROM gibson.student WHERE user_id = ?;';
					var inserts = decode.id;

					sql = mysql.format(sql, inserts);
					con.query(sql, function(err, results){
						if(err){
							console.log("Cannot query for student info.");
							return next(err);
						}

						else if(!results.length){
							console.log("Not a student.");
						}

						response.student_info = results[0];
						next(null);
					});
				}
			],
				function(err){
					con.release();
					if(err){	
						return err;
					}
					console.log(response);
					res.send(response);
				}
			);
		}
	});
});

router.get('/user/profile/courses', function(req, res, callback) {

	console.log("Getting registered courses");

	var decode = jwt.decode(req.cookies.access_token);
	//id of user
	var inserts = decode.id;

	var sql = "(SELECT course_id, course_code, course_name, default_fee, start_date, end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course WHERE start_date BETWEEN DATE_ADD(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY ORDER BY course_id DESC)";
	console.log(sql);
	var alreadyRegCourses = "(SELECT gibson.course.course_id, course_code, course_name, default_fee, gibson.course.start_date, gibson.course.end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course, gibson.user_course WHERE gibson.user_course.user_id = ? AND gibson.course.course_id = gibson.user_course.course_id AND gibson.course.start_date BETWEEN DATE_ADD(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY ORDER BY gibson.course.course_id DESC)";
	alreadyRegCourses = mysql.format(alreadyRegCourses, inserts);
	console.log(alreadyRegCourses);

	var nonRegCourses = sql + " EXCEPT " + alreadyRegCourses + ";";

	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("cannot get connection");
			return err;
		}

		con.query(nonRegCourses, function(err, results){
			con.release();

			if(err){
				console.log("Query error for finding courses");
				return err;
			}

			//check if there is a user with the info
			if(!results.length){
				console.log("No courses");
			}

			//send all course info to client
			//console.log(results);
			res.send(results);
		});
	});
});


router.get('/user/profile/schedule', function(req, res, callback) {
	console.log("Getting schedule");
	var decode = jwt.decode(req.cookies.access_token);
	var sql = "SELECT c.course_id, course_code, c.course_name, c.course_time, c.course_interval, c.course_description, c.course_days, c.start_date, c.end_date FROM course c INNER JOIN user_course uc ON c.course_id = uc.course_id  WHERE uc.user_id= ?;";
	var inserts = decode.id;
	sql = mysql.format(sql, inserts);

	connection.getConnection(function(err, con){
		if(err){
			con.release();
			console.log("cannot get connection");
			return err;
		}

		con.query(sql, function(err, results){
			con.release();

			if(err){
				console.log("Query error for finding user course schedule");
				return err;
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
router.post('/register', function(req, res, next){
	var decode = jwt.decode(req.cookies.access_token);
	//console.log(decode);

	// get courseid and parse for course_id
	var course_id = Number(req.body.course_id);

	// how to compare dates?
	var query_course_exists = 'SELECT * FROM gibson.course WHERE course_id = ? AND start_date BETWEEN DATE_ADD(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY';
	var inserts = [course_id];
	var course = {};

	connection.getConnection(function(err, con){
		if (err){
			con.release();
			console.log("cannot get connection");
			res.send(400, 'Connection Failed');
			return err;
		}
		async.waterfall([
			function(next){
				query_course_exists = mysql.format(query_course_exists, inserts);

				console.log(query_course_exists);
				con.query(query_course_exists, function(err, results){
					if (err)
					{
						console.log('Failed to query for courses');
						//res.send(400, 'Failed to query for courses.');
						return next(err);
					}

					if (!results.length) {
						console.log('No courses in database');
						//res.send(400, 'Course does not exist.');
						return next(new Error('No courses in database'));
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
						//res.send(400, 'Failed to query for registered courses.');
						return next(err);
					}
					if (results.length) {
						console.log('User registered for same course already!');
						//user already registered for course
						//res.send(400, 'User registered for same course already!.');
						return next(new Error('User already registered for course'));
					}

					//user not in course, so register the user in the course
					var query_register = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?";
					inserts = [decode.id, course_id, 'Enrolled', 'Registered for course ID ' + course_id, course_id];
					query_register = mysql.format(query_register, inserts);

					console.log(query_register);
					con.query(query_register, function(err, reg_res){
						if (err){
							console.log('Error occured during registration query');
							//res.send(400, 'Registration failed.');
							return next(err);
						}

						else{
							next(null, {message: "Registration Complete!"});
						}

					});
				});

			}],
			function(err, results){
				con.release();

				if(err){
					res.send(400, 'Failed to signup course!');
					return err;
				}

				console.log("User ID " + decode.id + " registered for course ID " + course_id);
				res.send(200, 'Registration Complete!');

			}
		);
	});
});

//logout of account
router.get('/logout', function(req,res,next){
	//clears cookie of account from browser
	res.clearCookie('access_token');
	res.clearCookie('priviledge');
	res.clearCookie('gibson_user');

	res.redirect('/');
});

module.exports = router;
