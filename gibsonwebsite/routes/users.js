var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');

/* GET users listing. */
router.get('/user/profile', function(req, res, next) {
	//send info back to user
	res.render('userProfile', {title: "Your Profile"}, function(err, html){
		res.send(html);
	});
});

router.post('/user/profile/changepassword', function(req, res, next){

	var decode = jwt.decode(req.cookies.access_token);
  	// SANITIZES EVERYTHING COMING IN FROM REQ
  	for(var i in req.body){

    	req.body[i] = sanitizer.sanitize(req.body[i]);
  	}

	if(req.body.newpass == req.body.confirmnewpass){

		connection.getConnection(function(err, con){

			if(err){
				console.log("user.js: Cannot get connection to the database.");
				return err;
			}
			else{

				var getPassword = "SELECT password FROM gibson.user WHERE user_id = ?;";
				getPassword = mysql.format(getPassword, [decode.id]);

				con.query(getPassword, function(err, userPassword){

					if(err){
						con.release();
						console.log("Cannot query the user's password");
						return err;

					}
					else if(!userPassword.length){
						con.release();
						console.log("Password for the user does not exist");
						return (new Error("Password for the user does not exist"));
					}
					else{

						if(bcrypt.compareSync(req.body.currentpass, userPassword[0].password)){
								//change user password
								var newPassword = bcrypt.hashSync(req.body.newpass, bcrypt.genSaltSync(Math.floor(3*Math.random())+10));
								var changePassword = "UPDATE gibson.user SET password = ? WHERE user_id = ?";
								changePassword = mysql.format(changePassword, [newPassword, decode.id]);

								con.query(changePassword, function(err, changedorNot){
									if(err){
										con.release();
										console.log("Could not query to change the password");
										return err;
									}
									else {
										con.query(mysql.format("SELECT username FROM gibson.user WHERE user_id = ?", [decode.id]), function(err, results){
											con.release();
											if(err){
												return (err);
											}
											else{
												res.send(results);
											}
										});
									}
								});
						}

						else {
							con.release();
							console.log("Current Password entered is incorrect.");
							return (new Error("Current Password entered is incorrect."));
						}
					}
				});
			}
		});
	}
	else{
		console.log("New password and confirm password is not the same.");
		return err;
	}
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

					var sql = "SELECT username, lname, fname, birth_date, age_group_id, gender, email, address, unit_no, city, postal_code, prov_abb, primary_phone, primary_extension, secondary_phone, secondary_extension, student FROM gibson.user, gibson.province WHERE user_id = ? AND user.province_id = province.province_id;";

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
					var sql = 'SELECT contact_id, lname, fname, relationship, contact_phone, contact_phone_extension FROM gibson.emergency_contact WHERE user_id = ?;';
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
						else if(results.length){
							response.student_info = results[0];
						}

						next(null);
					});
				},

				function(next){

					//Piggybacking off of this function, querying for age group list ;P
					con.query('SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group', function(err, results){
						if (err){
							console.log('user.js: Unable to query for age groups; /user/profile/info');
							return next(err);
						}
						else{
							response.age_group = results;
						}
					});

					// QUERYING FOR A LIST OF PROVINCES
					con.query('SELECT province_id, prov_abb FROM gibson.province;', function(err, results){
						if(err){
							console.log('user.js: Unable to query for provinces; /user/profile/info');
							return next(err);
						}
						else{
							response.provinces_list = results;
							next(null);
						}
					});
				},

				function(next){
					var sql = 'SELECT age_group_name, age_group_description FROM gibson.age_group WHERE age_group_id = (SELECT age_group_id FROM gibson.user WHERE user_id = ?)';
					var insert = decode.id;
					sql = mysql.format(sql, insert);
					con.query(sql, function(err, results){
						if (err || results.length == 0) {
							console.log("user.js: Failed to query for age group info");
							console.log(sql);
							return next(err);
						}
						else {
							var groupname = results[0].age_group_name + ' (' + results[0].age_group_description + ')';
							response.user_age_group = groupname;
						}

						next(null);
					});
				}
			],
				function(err){
					con.release();
					if(err){
						return err;
					}
					res.send(response);
				}
			);
		}
	});
});

router.get('/user/profile/courses', function(req, res, callback) {

	var decode = jwt.decode(req.cookies.access_token);
	//id of user
	var inserts = decode.id;

	//var sql = "CREATE VIEW allcourses AS (SELECT course_id, course_code, course_name, default_fee, start_date, end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course WHERE start_date BETWEEN DATE_ADD(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY);";
	//console.log(sql);
	//var alreadyRegCourses = "CREATE VIEW registeredcourses AS (SELECT gibson.course.course_id, course_code, course_name, default_fee, gibson.course.start_date, gibson.course.end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course, gibson.user_course WHERE gibson.user_course.user_id = ? AND gibson.course.course_id = gibson.user_course.course_id AND gibson.course.start_date BETWEEN DATE_ADD(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 6 MONTH) - INTERVAL 1 DAY ORDER BY gibson.course.course_id DESC);";
	//alreadyRegCourses = mysql.format(alreadyRegCourses, inserts);
	//console.log(alreadyRegCourses);

	var nonRegCourses = "SELECT a.course_id, a.course_code, a.course_description, a.notes, a.course_target, a.course_name, a.start_date, a.end_date, a.course_time, a.course_interval, a.course_language, a.course_days, a.default_fee, a.categories FROM gibson.course a WHERE NOT EXISTS (SELECT course_id FROM gibson.user_course uc WHERE a.course_id = uc.course_id AND uc.user_id = ?) AND a.end_date >= NOW() ORDER BY a.course_id DESC;";
	nonRegCourses = mysql.format(nonRegCourses, inserts);
	//console.log(nonRegCourses);

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
			//console.log(results);

			//send all course info to client
			//console.log(results);
			res.send(results);
		});
	});
});

router.get('/user/tags', function(req, res){
    var sql = "SELECT category_id, category_string, category_type FROM gibson.category_matrix;";

    connection.getConnection(function(err, con){
        con.query(sql, function(err, results){
			con.release();

            if(err){
                console.log("users.js: Cannot get a list of tags");
                return err;
            }

            else if (!results.length){
                console.log("users.js: No list of tags found")
            }

            res.send(results);
        });
    })
});

router.get('/user/profile/schedule', function(req, res, callback) {
	var decode = jwt.decode(req.cookies.access_token);
	var sql = "SELECT c.course_id, course_code, c.course_name, c.course_time, c.course_interval, c.course_description, c.course_language, c.course_target, c.notes, c.course_days, c.start_date, c.end_date FROM course c INNER JOIN user_course uc ON c.course_id = uc.course_id  WHERE uc.user_id= ?;";
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
			res.json(results);

		});
	});
});

//waterfall this
router.post('/register', function(req, res, next){
	var decode = jwt.decode(req.cookies.access_token);

	// get courseid and parse for course_id
	var course_id = Number(req.body.course_id);

	// how to compare dates?
	var query_course_exists = 'SELECT * FROM gibson.course WHERE course_id = ? AND end_date >= NOW()';
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
					else{

						//user not in course, so add course to cart
						var courseCart = {};

						// CART IS NULL -> INITIALIZE CART
						if(!req.cookies.cart){
							courseCart = {
								course_list: [
									course_id
								]
							};
						}
						// CART NOT NULL -> UPDATE CART
						else{
							courseCart = req.cookies.cart;
							var alreadyAdded = false;

							for(var i = 0; i < courseCart.course_list.length; i++){
								if (courseCart.course_list[i] == course_id)
									alreadyAdded = true;
							}

							if (!alreadyAdded)
								courseCart.course_list.push(course_id);
						}

						next(null, courseCart);
					}


					// var query_register = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?";
					// inserts = [decode.id, course_id, 'Enrolled', 'Registered for course ID ' + course_id, course_id];
					// query_register = mysql.format(query_register, inserts);
					//
					// con.query(query_register, function(err, reg_res){
					// 	if (err){
					// 		console.log('Error occured during registration query');
					// 		//res.send(400, 'Registration failed.');
					// 		return next(err);
					// 	}
					//
					// 	else{
					// 		next(null, {message: "Registration Complete!"});
					// 	}
					//
					// });
				});

			}],
			function(err, results){
				con.release();

				if(err){
					res.status(400).send('Failed to signup course!');
					return err;
				}

				res.clearCookie('cart');
				res.cookie('cart', results, {maxAge: 30*24*60*60*1000});
				res.status(200).send('Course added to cart.');
			}
		);
	});
});


// ROUTE FOR EDITING PERSONAL INFORMATION USER
router.post('/user/profile/edit/personalinfo', function(req, res){

    connection.getConnection(function(err,con){
        if(err){
            console.log('user.js: Cannot get connection.');
            res.status(500).send('Internal Server Error.');
        }
        else{

			var query = 'UPDATE gibson.user SET fname=?, lname=?, primary_phone=?, primary_extension=?, secondary_phone=?, secondary_extension=?, gender=?, age_group_id=?, address=?, postal_code=?, unit_no=?, city=?, province_id=? WHERE user_id = ?;';
			var inserts = [
				sanitizer.sanitize(req.body.fname),
				sanitizer.sanitize(req.body.lname),
				sanitizer.sanitize(req.body.primary_phone).replace(/\D+/g, ''),
				sanitizer.sanitize(req.body.primary_extension).replace(/\D+/g, ''),
				sanitizer.sanitize(req.body.secondary_phone).replace(/\D+/g, ''),
				sanitizer.sanitize(req.body.secondary_extension).replace(/\D+/g, ''),
				sanitizer.sanitize(req.body.gender),
				sanitizer.sanitize(req.body.age_group_id),
				sanitizer.sanitize(req.body.address),
				sanitizer.sanitize(req.body.postal_code).toUpperCase().replace(/ /g,''),
				sanitizer.sanitize(req.body.unit_no),
				sanitizer.sanitize(req.body.city),
				sanitizer.sanitize(req.body.province_id),
				jwt.decode(req.cookies.access_token).id
			];

			con.query(query, inserts, function(err, results){
				if(err){
					console.log('users.js: Error updating personal information; /user/profile/edit/personalinfo');
					res.status(500).send('Error updating personal information.');
				}
				else{
					res.status(200).send('Personal info updated.');
				}
			});
		}
    });
});

// ROUTE FOR EDITING STUDENT INFORMATION OF A USER
router.post('/user/profile/edit/studentinfo', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('users.js: Cannot get connection.');
            res.status(500).send('Internal Server Error');
        }
        else{

            async.waterfall([

                // QUERYING DATABASE FOR user_id AND student
                function(next){

                    var query = 'SELECT student FROM gibson.user WHERE user_id = ?;';
					var user_id = jwt.decode(req.cookies.access_token).id;

                    con.query(query, [user_id], function(err, results){
                        if(err){
                            return next({msg: 'Error querying for user'});
                        }
                        else if(results.length === 0){
                            return next({msg: 'User profile does not exist'});
                        }
                        else{
                            next(null, user_id, results[0].student);
                        }
                    });
                },

                // START TRANSACTION WITH THE DATABASE
                function(user_id, student, next){

                    con.query('START TRANSACTION;', function(err, results){
                        if(err){
                            return next({msg: 'Error starting transaction with database'});
                        }
                        else{
                            next(null, user_id, student);
                        }
                    });
                },

                // IF USER IS A STUDENT -> UPDATE USER'S STUDENT INFO
                function(user_id, student, next){
                    if(student == 0){
                        next(null, user_id, student);
                    }
                    else{

                        var query = 'UPDATE gibson.student SET school_name = ?, grade = ?, major = ?, esl_level = ? WHERE user_id = ?;';
                        var inserts = [
                            sanitizer.sanitize(req.body.schoolname),
                            sanitizer.sanitize(req.body.grade),
                            sanitizer.sanitize(req.body.major),
                            sanitizer.sanitize(req.body.esl),
                            user_id
                        ];

                        con.query(query, inserts, function(err, results){
                            if(err){
                                return next({msg: 'Error updating student information'});
                            }
                            else{
                                next(null, user_id, student);
                            }
                        });
                    }
                },

                // IF USER IS NOT A STUDENT INSERT NEW ENTRY IN STUDENT TABLE AND UPDATE user TABLE
                function(user_id, student, next){
                    if(student == 1){
                        next(null);
                    }
                    else{

                        var query =  'INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level) VALUES (?,?,?,?,?); ';
                            query += 'UPDATE gibson.user SET student = 1 WHERE user_id =?;';
                        var inserts = [
                            user_id,
                            sanitizer.sanitize(req.body.schoolname),
                            sanitizer.sanitize(req.body.grade),
                            sanitizer.sanitize(req.body.major),
                            sanitizer.sanitize(req.body.esl),
                            user_id
                        ];

                        con.query(query, inserts, function(err, results){
                            if(err){
                                return next({msg: 'Error updating student information'});
                            }
                            else{
                                next(null);
                            }
                        });
                    }
                }
            ],

            // FINAL FUNCTION -> HANDLES ERROR/SUCCESS
            function(error){
                if(err){
                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        console.log('users.js: ' +error.msg +'; /user/profile/edit/studentinfo');
                        res.status(500).send('Failed to update student information.');
                    });
                }
                else{
                    con.query('COMMIT;', function(err, results){
                        con.release();
                        res.status(200).send('Student information updated.');
                    });
                }
            });
        }
    });
});


// ROUTE FOR EDITING STUDENT INFORMATION OF A USER
router.post('/user/profile/edit/emegencyinfo', function(req, res){

	// GETTING CONNECTION
	connection.getConnection(function(err, con){
		if(err){
			console.log('users.js: Cannot get connection.');
            res.status(500).send('Internal Server Error');
		}
		else{

			async.waterfall([

				//COUNTS EMERGENCY CONTACTS
				function(next){
					var query = 'SELECT contact_id FROM gibson.emergency_contact WHERE user_id = ?;';
					var user_id = jwt.decode(req.cookies.access_token).id;
					var newContacts;

					con.query(query, [user_id], function(err, results){
						if(err){
							return next({msg: 'Error counting emergency contacts'});
						}
						else{

							if(req.body.emergencyfname3 && req.body.emergencylname3 && req.body.relationship3 && req.body.ephone3){
								newContacts = [
									[user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext1).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP'],
			                        [user_id, sanitizer.sanitize(req.body.emergencylname2), sanitizer.sanitize(req.body.emergencyfname2), sanitizer.sanitize(req.body.relationship2), sanitizer.sanitize(req.body.ephone2).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext2).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP'],
			                        [user_id, sanitizer.sanitize(req.body.emergencylname3), sanitizer.sanitize(req.body.emergencyfname3), sanitizer.sanitize(req.body.relationship3), sanitizer.sanitize(req.body.ephone3).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext3).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP']
								];
							}
							else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
								newContacts = [
									[user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext1).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP'],
			                        [user_id, sanitizer.sanitize(req.body.emergencylname2), sanitizer.sanitize(req.body.emergencyfname2), sanitizer.sanitize(req.body.relationship2), sanitizer.sanitize(req.body.ephone2).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext2).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP']
								];
							}
							else{
								newContacts = [
									[user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, ''), sanitizer.sanitize(req.body.ephoneext1).replace(/\D+/g, ''), 'CURRENT_TIMESTAMP']
								];
							}

							next(null, results, newContacts);
						}
					});
				},

				// STARTS TRANSACTION
				function(records, newContacts, next){
					con.query('START TRANSACTION;', function(err, results){
						if(err){
							return next({msg: 'Error counting emergency contacts'});
						}
						else{
							next(null, records, newContacts);
						}
					});
				},

				// CASE WHERE LESS CONTACT IS ENTERED THAN THERE IS IN DATABASE
				function(records, newContacts, next){
					if(newContacts.length >= records.length){
						next(null, records, newContacts);
					}
					else{
						var query = '';

						for(int i = 0; i < records.length; i++){
							if(i < newContacts.length){
								newContacts[i].push(records[i]);
								query += mysql.format('UPDATE gibson.emergency_contact SET lname=?, fname=?, relationship=?, contact_phone=?, contact_phone_extension=? creation_date=? WHERE contact_id = ?;', newContacts[i]);
							}
							else{
								query += mysql.format('DELETE FROM gibson.emergency_contact WHERE contact_id = ?', [records[i]]);
							}
						}

						con.query(query, function(err, results){
							if(err){
								return next({msg: 'Error in case 1'});
							}
							else{
								next(null, records, newContacts);
							}
						});
					}
				},

				// CASE WHERE EQUAL CONTACT IS ENTERED COMPARED TO RECORDS IN DATABASE
				function(records, newContacts, next){
					if(newContacts.length > records.length || newContacts.length < records.length){
						next(null, records, newContacts);
					}
					else{
						var query = '';

						for(int i = 0; i < records.length; i++){
							newContacts[i].push(records[i]);
							query += mysql.format('UPDATE gibson.emergency_contact SET lname=?, fname=?, relationship=?, contact_phone=?, contact_phone_extension=? creation_date=? WHERE contact_id = ?;', newContacts[i]);
						}

						con.query(query, function(err, results){
							if(err){
								return next({msg: 'Error in case 2'});
							}
							else{
								next(null, records, newContacts);
							}
						});
					}
				},

				// CASE WHERE MORE CONTACT IS ENTERED THAN THERE IS IN DATABASE
				function(records, newContacts, next){
					if(newContacts.length <= records.length){
						next(null);
					}
					else{
						var query = '';

						for(int i = 0; i < newContacts.length; i++){
							if(i < records.length){
								newContacts[i].push(records[i]);
								query += mysql.format('UPDATE gibson.emergency_contact SET lname=?, fname=?, relationship=?, contact_phone=?, contact_phone_extension=? creation_date=? WHERE contact_id = ?;', newContacts[i]);
							}
							else{
								newContacts[i].pop();
								query += mysql.format('INSERT INTO gibson.emergency_contact (user_id, lname, fname, relationship, contact_phone, contact_phone_extension) VALUES(?, ?, ?, ?, ?, ?);', newContacts[i]);
							}
						}

						con.query(query, function(err, results){
							if(err){
								return next({msg: 'Error in case 3'});
							}
							else{
								next(null);
							}
						});
					}
				}
			],

			// FINAL FUNCTION -> HANDLES ERROR/SUCCESS
			function(error){
				if(err){
					con.query('ROLLBACK;', function(err, results){
						console.log('users.js: ' +error.msg +'; /user/profile/edit/emegencyinfo');
						con.release();
						res.status(500).send('Error updating emergency contact(s).');
					});
				}
				else{
					con.query('COMMIT;', function(err, results){
						con.release();
						res.status(200).send('Emergency contact(s) updated.');
					});
				}
			});
		}
	});
});


router.post('/user/profile/edit', function(req, res, next){
	// GETTING CONNECTION
	connection.getConnection(function(err, con){
		if (err){
			console.log('users.js: Unable to get connection; user/profile/edit');
			return err;
		}
		else{

			// QUERYING FOR USER ID
			con.query('SELECT user_id FROM gibson.user WHERE username = ?;', [req.body.username], function(err, results){
				if(err){
					con.release();
					console.log('users.js: Unable to query for user_id; user/profile/edit');
					return err;
				}
				else{
					var userId = results[0].user_id;

					// START TRANSACTION
					con.query('START TRANSACTION;', function(err, results){
						if(err){
							con.release();
							console.log('user.js: Error starting transaction; user/profile/edit');
							return err;
						}
						else{

							// QUERYING TO UPDATE USER PROFILE
							var query = 'UPDATE gibson.user SET fname = ?, lname = ?, primary_phone = ?, primary_extension = ?, secondary_phone = ?, secondary_extension = ?, gender = ?, age_group_id = ?, address = ?, city = ?, unit_no = ?, province_id = (select province_id from gibson.province where prov_abb = ?), postal_code = ? WHERE user_id = ?;';
							var inserts = [req.body.fname, req.body.lname, req.body.primary_phone, req.body.primary_extension, req.body.secondary_phone, req.body.secondary_extension, req.body.gender, req.body.age_group, req.body.address, req.body.city, req.body.unit_no, req.body.province, req.body.postal_code, userId];

							query = mysql.format(query, inserts);

							con.query(query, function(err, results){
								if(err){
									// ROLLING BACK CHANGES
									con.query('ROLLBACK;', function(err, results){
										con.release();
										console.log('user.js: Error updating profile information.; user/profile/edit');
										return err;
									});
								}
								else{

									// QUERYING TO UPDATE STUDENT INFORMATION
									var studentQuery = 'UPDATE gibson.student SET school_name = ?, grade = ?, major = ?, esl_level = ? WHERE user_id = ?;';
									var studentInsert = [req.body.schoolname, req.body.grade, req.body.major, req.body.esl, userId];
									studentQuery = mysql.format(studentQuery, studentInsert);

									con.query(studentQuery, function(err, results){
										if (err){
											// ROLLING BACK CHANGES
											con.query('ROLLBACK;', function(err, results){
												con.release();
												console.log('user.js: Error updating student information.; user/profile/edit');
												return err;
											});
										}
										else{

											// EDIT EMERGENCY CONTACTS.
											con.query('SELECT contact_id FROM gibson.emergency_contact WHERE user_id = ?;', [userId], function(err, results){
												if(err){
													con.query('ROLLBACK;', function(err, results){
														con.release();
														console.log('user.js: Error querying for emergency contacts; user/profile/edit');
													});
												}
												else{
													// ARRAY FOR EMERGENCY CONTACTS
													var emContacts = [];

			                    if(req.body.emergencyfname3 && req.body.emergencylname3 && req.body.relationship3 && req.body.ephone3){
			                      emContacts = [

			                        [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1, req.body.ephoneext1, results[0]? results[0].contact_id:null],
			                        [userId, req.body.emergencyfname2, req.body.emergencylname2, req.body.relationship2, req.body.ephone2, req.body.ephoneext2, results[1]? results[1].contact_id:null],
			                        [userId, req.body.emergencyfname3, req.body.emergencylname3, req.body.relationship3, req.body.ephone3, req.body.ephoneext3, results[2]? results[2].contact_id:null]

			                      ];
			                    }
			                    else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
			                      emContacts = [

			                        [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1, req.body.ephoneext1, results[0]? results[0].contact_id:null],
			                        [userId, req.body.emergencyfname2, req.body.emergencylname2, req.body.relationship2, req.body.ephone2, req.body.ephoneext2, results[1]? results[1].contact_id:null]

			                      ];
			                    }
			                    else{
			                      emContacts = [

			                        [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1, req.body.ephoneext1, results[0]? results[0].contact_id:null]

			                      ];
			                    }

													var query = '';

													for (var i = 0; i < emContacts.length; i++){
														if (i < results.length)

															query += mysql.format('UPDATE gibson.emergency_contact SET user_id = ?, fname = ?, lname = ?, relationship = ?, contact_phone = ?, contact_phone_extension = ? WHERE contact_id = ?;', emContacts[i]);
														else
															query += mysql.format('INSERT INTO gibson.emergency_contact (user_id, fname, lname, relationship, contact_phone, contact_phone_extension) VALUES (?, ?, ?, ?, ?, ?);', emContacts[i]);
													}

													con.query(query, function(err, results){
														if (err){
															con.query('ROLLBACK', function(err, results){
																con.release();
																console.log('users.js: Error editing emergency contacts');
															});
														}
														else{
															// NO ERROR -> COMMIT CHANGES
															con.query('COMMIT;', function(err, results){
																con.release();
																res.status(200).send('Profile info updated.');
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

//GET TRANSACTION HISTORY
router.post('/user/profile/history', function(req, res, next){
	var decode = jwt.decode(req.cookies.access_token);
	var sql = 'SELECT transaction_id, payment_id, create_time, state, payer_first_name, payer_last_name, currency, total, tax, description FROM gibson.transaction_history th WHERE th.user_id = ? ORDER BY create_time DESC LIMIT ?';
	var inserts = [decode.id, Number(sanitizer.sanitize(req.body.query_limit))];

	sql=mysql.format(sql, inserts);
	connection.getConnection(function(err, con){
		if(err){
			console.log('users.js: Could not connect to DB');
			res.send(401);
			return err;
		}
		con.query(sql, function(err, results){
			con.release();
			if(err){
				console.log('users.js: Could not get transaction history for user:' + decode.id);
				res.send(401);
				return err;
			}
			else{
				res.send(results);
			}
		});
	});
});

router.get('/user/listfiller', function(req, res){

	var response = {};
	connection.getConnection(function(err, con){
        if(err){
            console.log('user.js: Error getting connection; /volunteer/portal');
            res.status(500);
        }
        else{
            //Run Queries in Parallel
            async.parallel({
                province_list: function(next){
                    var sql = "SELECT province_id, prov_abb FROM gibson.province;";
                    con.query(sql, function (err, results){
						response.provinces = results;
                        next(err, results);
                    });
                },
                age_group_list: function(next){
                    var sql = "SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group;"
                    con.query(sql, function (err, results){
						response.age_groups = results;
                        next(err, results);
                    });
                }
            },
            //Return results
            function (err, results){
                con.release();
                if(err){
                    console.log('user.js: Database Query failed');
                    res.status(500).send("Fail to get dropdown list info");
                }
                else{
                    res.send(response);
                }
            });
        }
	});
});

//logout of account
router.get('/logout', function(req,res,next){
	//clears cookie of account from browser
	res.clearCookie('access_token');
	res.clearCookie('admin');
	res.clearCookie('volunteer');
	res.clearCookie('staff');
	res.clearCookie('user_info');
	res.clearCookie('gibson_user');
	res.clearCookie('cart');

	res.redirect('/');
});

module.exports = router;
