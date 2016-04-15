var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var adminFunctions = require('../public/js/bulkQueries');
var readSQL = require('../public/js/readSQL');


router.get('/admin/profile', function(req, res, next) {
  res.render('adminviews', { title: 'Admin Profile' });
});

/* Get all users */
router.get('/admin/profile/info', function(req, res) {

    var decode = jwt.decode(req.cookies.access_token);

    var sql = "SELECT fname, lname, username, email, primary_phone, secondary_phone, gender, birth_date, address, send_notification, student FROM gibson.user";
    var inserts = decode.id;
    sql = mysql.format(sql, inserts);

    connection.getConnection(function(err, con) {
        if(err) {
          con.release();
          console.log("cannot get connection");
          return err;
        }

        con.query(sql, function(err, results){
            con.release();

            if(err) {
                console.log("Query error for finding user info");
                return err;
            }

            //check if there is a user with the info
            if(!results.length) {
                console.log("No User");
                return new Error('No user exist.');
            }

            //send all course info to client
            res.send(results);
        });
    });
});

// con.query(sql, function(err, results){
        //     con.release();
        //     if(err){
        //         console.log("adminqueries.js: Cannot get the user profile.");
        //         return err;
        //     }

        //     if(!results.length){
        //         console.log("adminqueries.js: User profile does not exist");
        //         res.status(404).send("User profile does not exist.");
        //     }
        //     else{
        //         res.render('detailedprofile', {title: req.params.username + "'s Profile", info: results[0] });
        //     }
        // });

router.get('/profile/:username', function(req, res, next){

    // HUGE OBJECT
    var response = {};

    connection.getConnection(function(err,con){
        if(err){
            console.log("adminqueries.js: Cannot get connection.");
            res.status(500).send('Internal Server Error');
        }
        else{

            async.waterfall([

                function(next){
                    var sql = "SELECT user_id, lname, fname, birth_date, gender, email, address, unit_no, city, postal_code, province_name, primary_phone, secondary_phone, secondary_phone, student FROM gibson.user, gibson.province WHERE username = ? AND user.province_id = province.province_id;";

                    con.query(sql, [req.params.username], function(err, results){
                        if(err){
                            console.log('adminqueries.js: Unable to query for user information; /profile/:username');
                            return next ({no: 500, msg: "Unable to query for user information"}, null);
                        }
                        else if(results.length === 0){
                            console.log('adminqueries.js: User does not exist; /profile/:username');
                            return next ({no: 500, msg: "No user with that username."}, null);
                        }
                        else{
                            response.user_info = results[0];
                            next(null, results[0].user_id);
                        }
                    });
                },

                function(userId, next){
                    var sql = "SELECT school_name, grade, major, esl_level FROM gibson.student WHERE user_id = ?;";

                    con.query(sql, [userId], function(err, results){
                        if(err){
                            console.log('adminqueries.js: Unable to query for student information; /profile/:username');
                            return next ({no: 500, msg: "Unable to query for student information"}, null);
                        }
                        else{
                            response.student_info = results[0];
                            next(null, userId);
                        }
                    });
                },

                function(userId, next){
                    var sql = "SELECT contact_id, lname, fname, relationship, contact_phone FROM gibson.emergency_contact WHERE user_id = ?;";

                    con.query(sql, [userId], function(err, results){
                        if(err){
                            console.log('adminqueries.js: Unable to query for contact information; /profile/:username');
                            return next ({no: 500, msg: "Unable to query for contact information"}, null);
                        }
                        else{
                            response.emergency_contacts = results;
                            next(null);
                        }

                    });
                },

                function(next){

                    con.query("SELECT province_id, province_name, prov_abb FROM gibson.province;", function(err, results){
                        if(err){
                            console.log('adminqueries.js: Unable to query for province information; /profile/:username');
                            return next ({no: 500, msg: "Unable to query for province information"}, null);
                        }
                        else{
                            response.province = results;
                            next(null);
                        }
                    });
                }

            ],
            function(err){
                con.release();

                if(err){
                    res.status(err.no).send(err.msg);
                }
                else{
                    res.status(200).send(response);
                }
            });
        }

    });
});

router.post('/profile/:username/edit/personalinfo', function(req, res){

    var sql = "SELECT user_id FROM gibson.user WHERE username = ? AND rank_id < 4;";
    var inserts = [req.params.username];

    connection.getConnection(function(err,con){
        if(err){
            console.log("adminqueries.js: Cannot get connection.");
        }
        con.query(sql, function(err, results){

            if(err){
                con.release();
                console.log("adminqueries.js: Cannot get the user profile.");
                return err;
            }

            if(!results.length){
                con.release();
                console.log("adminqueries.js: User profile does not exist");
                res.status(404).send("User profile does not exist.");
            }
            else{
                //can edit
                var query = 'UPDATE gibson.user SET fname = ?, lname = ?, primary_phone = ?, secondary_phone = ?, gender = ?, birth_date = ?, address = ?, city = ?, unit_no = ?, province_id = (select province_id from gibson.province where province_name = ?), postal_code = ? WHERE user_id = ?;';
                var inserts = [req.body.fname, req.body.lname, req.body.primary_phone, req.body.secondary_phone, req.body.gender, req.body.birth_date, req.body.address, req.body.city, req.body.unit_no, req.body.province, req.body.postal_code, results[0].user_id];
                query = mysql.format(query, inserts);

                con.query(query, function(err, results){
                    con.release();
                    if(err){
                        console.log('adminqueries.js: Unable to edit personal info.');
                        res.status(500).send('Internal Server Error');
                    }
                    else{
                        res.status(200).send('User personal info changed.');
                    }
                });
            }
        });
    });
});

router.post('/profile/:username/edit/studentinfo', function(req, res){

    var sql = "SELECT user_id, student FROM gibson.user WHERE username = ? AND rank_id < 4;";
    var inserts = [req.params.username];

    connection.getConnection(function(err,con){
        if(err){
            console.log("adminqueries.js: Cannot get connection.");
        }
        con.query(sql, function(err, results){

            if(err){
                con.release();
                console.log("adminqueries.js: Cannot do the edit the user profile.");
                return err;
            }

            if(!results.length){
                con.release();
                console.log("adminqueries.js: User profile does not exist");
                res.status(404).send("User profile does not exist.");
            }
            else{
                var userid = results[0].user_id;
                if(results[0].student == 0){

                    var insertquery = "INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level) VALUES (?,?,?,?,?);";
                    var inserts = [userid, req.body.schoolname, req.body.grade, req.body.major, req.body.esl];
                    insertquery = mysql.format(insertquery, inserts);

                    con.query('START TRANSACTION', function(err, results){
                        if(err){
                            con.release();
                            res.status(500);
                        }
                        else{

                            con.query(insertquery, function(err, results){
                                if(err){
                                    con.release();
                                    res.send(500);
                                }
                                else{

                                    con.query('UPDATE gibson.user SET student = 1 WHERE user_id =?;', [userid], function(err, results){
                                        if(err){
                                            con.query('ROLLBACK', function(err, results){
                                                con.release();
                                                res.send(500);
                                            });
                                        }
                                        else{
                                            con.query('COMMIT', function(err, results){
                                                con.release();
                                                res.status(200).send("Edited Student information");
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });


                }
                else{
                    var query = 'UPDATE gibson.student SET school_name = ?, grade = ?, major = ?, esl_level = ? WHERE user_id = ?;';
                    var insert = [req.body.schoolname, req.body.grade, req.body.major, req.body.esl, userid];
                    query = mysql.format(query, insert);

                    con.query(query, function(err, results){
                        con.release();
                        if(err){
                            console.log('adminqueries.js: Unable to edit student info.');
                            res.status(500).send('Internal Server Error');
                        }
                        else{
                            res.status(200).send('User student info changed.');
                        }
                    });
                }
            }
        });
    });
});


router.get('/admin/profile/courses', function(req, res){

    //in query, counts the number of users who take each course from user_course table.
    //for a more efficient, less readable count query, look at http://stackoverflow.com/questions/944099/mysql-count-on-multiple-tables
    var sql = "SELECT course_id, course_name, course_code, default_fee, start_date, end_date, course_time, course_interval, course_language, course_target, course_description, course_days, course_limit, (SELECT COUNT(*) FROM user_course uc WHERE uc.course_id=co.course_id) AS enroll_count FROM gibson.course co ORDER BY course_id DESC";

    connection.getConnection(function(err, con){
        if(err){
            console.log("adminqueries.js: Cannot get connection");
            return err;
        }

        con.query(sql, function(err, results){
            con.release();

            if(err){
                console.log("adminqueries.js: Query error for finding courses");
                return err;
            }

            //check if there is a user with the info
            if(!results.length){
                console.log("adminqueries.js: No courses found!");
            }

            //send all course info to client
            //console.log(results);
            res.send(results);
        });
    });
});

// SENDS A LIST OF STUDENTS
router.get('/admin/profile/courses/students', function(req, res){

  var query =  'SELECT user.user_id, user.username, user.fname, user.lname, user.email ';
      query += 'FROM gibson.user INNER JOIN gibson.user_course ';
      query += 'ON user_course.user_id = user.user_id ';
      query += 'WHERE user_course.course_id = ?;';

  query = mysql.format(query, [req.query.course_id]);

  connection.getConnection(function(err, con){
    if (err){
      console.log("adminqueries.js: Error getting connection to database.");
      return err;
    }
    else{
      con.query(query, function(err, results){
        con.release();

        if (err){
          console.log("adminqueries.js: Error querying for list of students.");
          res.status(500).send("Internal Server Error.");
        }
        else{
          res.status(200).send(results);
        }
      });
    }
  });
});

/*
router.get('/admin/profile/addCourse', function(req, res){
    res.sendStatus(200);
});
*/

router.post('/validateCourse', function(req, res){
	console.log("Validating course name " + req.body.course_name);
    async.waterfall([
        //Check Database for duplicate course codes and course names
        function (next){
			if (req.body.course_name==null || req.body.course_name=='') {
				return next (new Error("Course name is not filled in!"), null);
			}
			if (req.body.course_code==null || req.body.course_code=='') {
				return next (new Error("Course code is not filled in!"), null);
			}
            var sql = "SELECT course_id FROM gibson.course WHERE course_name = ? OR course_code = ?;";
            var inserts = [req.body.course_name, req.body.course_code];

            sql = mysql.format(sql, inserts);
            connection.getConnection(function(err, con){
                con.query(sql, function(err, results){
                    con.release();
                    if(err){
                        return next(new Error("Error querying add course validation!"), null);
                    }

                    else if(results.length){
                        return next(new Error("Course name or course code already exists!"), null);
                        
                    }

                    else{
						console.log("adminqueries.js:Checked Course name/code is unique");
                        next();
                    }
                });
            });
        },

        //Validate fields for Course Information
        function (next){
            languages = sanitizeJSONArray(req.body["languages[]"]);

            if(req.body.addcost==null || req.body.addcost=='') {
                return next(new Error("Cost field is missing!"), null);}
            else if(req.body.addtarget==null || req.body.addtarget=='')
                return next(new Error("Target field is missing!"), null);
            else if(req.body.adddescription==null || req.body.adddescription=='')
                return next(new Error("Description field is missing!"), null);
            else {
                for(var i = 0; i < languages.length; i++){
                    if(languages[i]==null || languages[i]==''){
                        return next(new Error ("Language field " + (i+1) + " is missing!"), null);
                    }
                    else if(i == languages.length - 1){
						console.log("adminqueries.js:Checked cost, target, description, Languages");
                        next();
                    }
                }
            }
        },

        //Validate fields for Instructor Information
        function (next){
        //    if(req.body.instructor_name==null || req.body.instructor_name=='')
        //        return next(new Error("Instructor Name field is missing!"), null);
        //    else
			console.log("Checked Instructor info (?)");
            next();
        },

        //Validate Schedule field
        function (next){
			var course_days = makeJSONArray(sanitizeJSONArray(req.body['course_days[]']));
			var adhoc_days = makeJSONArray(sanitizeJSONArray(req.body['adhoc_days[]']));
            if(req.body.addstartdate==null || req.body.addstartdate=='')
                return next(new Error("Starting Date field is missing!"), null);
            else if(req.body.addenddate==null || req.body.addenddate=='')
                return next(new Error("Ending Date field is missing!"), null);
            else if(req.body.addinterval==null || req.body.addinterval==''){
				console.log(req.body.addinterval);
                return next(new Error("No Interval field selected!"), null);
			}
            else if(!checkSchedule(course_days)){
				console.log("adminqueries.js:Checking scheduled days");
                return next(new Error("Bad schedule field found!"), null);
            }
			else if (!checkSchedule(adhoc_days)) {
				console.log("adminqueries.js:Checking ad-hoc days");
				return next(new Error("Bad ad-hoc day field found!"), null);
			}
            else{
				console.log("Checked start & end date, interval, scheduled days");
                next();
            }
        }

        ],function(err, results){
            if(err){
                console.log("adminqueries.js:"+err.message);
                res.status(400).send(err.message);
            }
            else{
                console.log("adminqueries.js: Validated " + req.body.course_name + "!");
                res.status(200).send("Validated!");
            }
        });
});


// ROUTE TO ADD NEW EVENT
router.post('/admin/addEvent', function(req, res){

  var startDate = req.body.startdate +' 00:00:00';
  var endDate = req.body.enddate +' 00:00:00';

  var query = 'INSERT INTO gibson.website_alert (init_date, end_date, alert_msg, alert_type, start_alert) ';
      query +='VALUES(?, ?, ?, ?, 0)';

  query = mysql.format(query, [startDate, endDate, req.body.message, req.body.eventtype]);

  connection.getConnection(function(err, con){
    if(err){
      res.status(500).send('Internal Server Error');
    }
    else{
      con.query(query, function(err, result){
        con.release();

        if(err){
          console.log('adminqueries.js: Unable to add new event.');
          res.status(500).send('Unable to add new event.');
        }
        else{
          res.status(200).send('Event added');
        }
      });
    }
  });
});

router.post('/admin/profile/addCourse', function(req, res){
    var sql = readSQL.getSQL('dml_addcourse.txt');
	//Note: *create DML closures apply .shift() on to req.body*

	// HAVE TO SANITIZE days here since used in helper function AND bulk queries
	var languages, course_days, adhoc_days;

	languages = sanitizeJSONArray(req.body["languages[]"]);
	course_days = sanitizeJSONArray(req.body["course_days[]"]);
	adhoc_days = sanitizeJSONArray(req.body["adhoc_days[]"]);


    language_dml = createLanguageDML(languages);
	course_days_dml = createCourseDaysDML(course_days);
    adhoc_days_dml = createAdhocDaysDML(adhoc_days);

    var inserts = [req.body.addcoursecode, req.body.addcoursename, req.body.instructor_username, req.body.instructor_name, req.body.addcost, req.body.course_limit,
                   req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body.addtarget, req.body.adddescription,
                   req.body.instructor_bio, ''];

    sql = mysql.format(sql, inserts);
    sql = sql.replace('language_dml', language_dml);
    sql = sql.replace('course_days_dml', course_days_dml);
    console.log(sql);

    connection.getConnection(function(err,con){
        if(err){
            con.release();
            console.log("adminqueries.js: cannot get connection");
            return err;
        }

        async.waterfall([
            function (next){
                con.query("START TRANSACTION;", function(err, results){
                    if(err){
                        console.log("adminqueries.js: Cannot start transactions.");
                        return next(err);
                    }

                    next();
                });
            },

            function (next){
                console.log("adminqueries.js:DML statement addcourse");
                con.query(sql, function(err, results){
                    if(err){
                        console.log("adminqueries.js: Query error for inserting course to database");
                        return next(err);
                    }
                    console.log(results.insertId);
                    next(null, results.insertId);
                });
            },

            function (course_id, next){
                console.log("adminqueries.js:DML statement add course days");
                if(adminFunctions.getScheduledDays(course_id, req.body.addstartdate, req.body.addenddate, req.body.addinterval, course_days)){
                    return new Error('Error adding course schedule');
                }

                next(null, course_id);
            },
			function (course_id, next) {
				console.log("adminqueries.js:DML statement add adhoc days");
				if (adminFunctions.getAdhocDays(course_id, adhoc_days)){
					return new Error('Error adding individual days');
				}
				next(null, null);
			}
        ],
        function (err, results){
            if(err){
                con.query("ROLLBACK;", function(err, results){
                    con.release();
                    console.log("adminqueries.js: Rollbacked because " + err);
					res.end();
                    return err;
                });
            }

            else{
                con.query("COMMIT;", function(err, results){
                    con.release();
                    console.log("adminqueries.js: Commited course!");
					res.send("Add course complete!");
                    //res.redirect('/admin/profile');
                });
            }
        });
    });
});

function sanitizeJSONArray (a) {
	if (a == null)
		return [];
	else if (a.constructor === Array)
		return a;
	else return [a];
}

function makeJSONArray (a) {
	var res = [];
	for (var i = 0; i < a.length; i++){
		res.push(JSON.parse(a[i]));
	}
	return res;
}

function createLanguageDML(languages){
	/* if (languages == null) {
		return "";
	}
	else if (!(languages.constructor === Array)){
			languages = [languages];
	} */
	if (languages.length == 0) {
		return 'JSON_ARRAY()';
	}
    var language_dml='';

    //Make JSON array for Languages
    language_dml+='JSON_ARRAY(';
    for(var i=0; i < languages.length; i++){
        language_dml+=mysql.escape(languages[i]) + ',';
    }
    //remove last , for languages array
    language_dml=language_dml.slice(0, -1);
    language_dml+=')';

    return language_dml;
}

function createCourseDaysDML(course_days){

	/* if (course_days == null) {
		return 'JSON_ARRAY()';
	}
	else if (!(course_days.constructor === Array)){
			course_days = [course_days];
	} */
	if (course_days.length == 0) {
		return 'JSON_ARRAY()';
	}
    var course_days_dml='';
	console.log(course_days);
    //Make JSON array for course days
    course_days_dml='JSON_ARRAY(';
    for(var i=0; i < course_days.length; i++){
        var json = JSON.parse(course_days[i]);
        var schedule='JSON_OBJECT(';
        var day = json.day;
        var start_time = json.start_time;
        var end_time = json.end_time;

        schedule+= '\'day\',' +  mysql.escape(day) + ',';
        schedule+= '\'start_time\',' + mysql.escape(start_time) + ',';
        schedule+= '\'end_time\',' + mysql.escape(end_time);
        schedule+= '),';

        course_days_dml+=schedule;
    }
    //remove last , for course days array
    course_days_dml=course_days_dml.slice(0, -1);
    course_days_dml+=')';
    console.log(course_days_dml);
    return course_days_dml;
}

function createAdhocDaysDML(adhoc_days){
	/* if (adhoc_days == null) {
		return mysql.escape('');
	}
	else if (!(adhoc_days.constructor === Array)){
			adhoc_days = [adhoc_days];
	} */
	if (adhoc_days.length == 0) {
		return 'JSON_ARRAY()';
	}
    var adhoc_days_dml='';
	console.log("after: " + adhoc_days);
    //Make JSON array for adhoc days
    adhoc_days_dml='JSON_ARRAY(';
    for(var i=0; i < adhoc_days.length; i++){
        var json = JSON.parse(adhoc_days[i]);
        var schedule='JSON_OBJECT(';
        var day = json.day;
        var start_time = json.start_time;
        var end_time = json.end_time;

        schedule+= '\'day\',' + mysql.escape(day) + ',';
        schedule+= '\'start_time\',' + mysql.escape(start_time) + ',';
        schedule+= '\'end_time\',' + mysql.escape(end_time);
        schedule+= '),';

        adhoc_days_dml+=schedule;
    }
    //remove last , for adhoc days array
    adhoc_days_dml=adhoc_days_dml.slice(0, -1);
    adhoc_days_dml+=')';
	console.log(adhoc_days_dml);
    return adhoc_days_dml;
}

//TODO: REDO
function checkSchedule(course_days){
	var faulty = false;
	for (var i = course_days.length - 1; i >= 0; i--){
		if (course_days[i].day == '' || course_days[i].day == null) {
			faulty = true;
			console.log("adminqueries.js: schedule " + i + "'s day is not filled in!");
		}
		if (course_days[i].start_time == '' || course_days[i].start_time == null) {
			faulty = true;
			console.log("adminqueries.js: schedule " + i + "'s start_time is not filled in!");
		}
		if (course_days[i].end_time == '' || course_days[i].end_time == null) {
			faulty = true;
			console.log("adminqueries.js: schedule " + i + "'s end time is not filled in!");
		}
		if (faulty) return false;
	}
	return true;
}

module.exports = router;
