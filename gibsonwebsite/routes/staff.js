var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var adminFunctions = require('../public/js/bulkQueries');
var readSQL = require('../public/js/readSQL');

// RENDERING STAFF PAGE
router.get('/staff/portal', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('staff.js: Error getting connection; /volunteer/portal');
            res.status(500).send();
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
                    var sql = "SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group;";
                    con.query(sql, function (err, results){
                        next(err, results);
                    });
                }
            },
            //Return results
            function (err, results){
                con.release();
                if(err){
                    console.log('staff.js: Database Query failed');
                    res.status(500).send("Failure");
                }
                else{
                    res.render('staffview', { title: 'Staff Portal', province_list: results.province_list, age_group_list: results.age_group_list, MAX: 3});
                }
            });
        }
    });
});

// ROUTE FOR GETTING DETAILED INFORMATION OF A USER
router.get('/staff/portal/detailedprofile', function(req, res){

    // OBJECT WITH USER INFORMATION
    var response = {};

    connection.getConnection(function(err, con){
        if(err){
            console.log('staff.js: Cannot get connection; /staff/portal/detailedprofile');
            res.status(500).send('Internal Server Error');
        }
        else{

            async.waterfall([

                function(next){
                    var sql = 'SELECT user_id, lname, fname, birth_date, gender, email, address, unit_no, city, postal_code, province_name, primary_phone, secondary_phone, secondary_phone, student FROM gibson.user, gibson.province WHERE username = ? AND user.province_id = province.province_id;';

                    con.query(sql, [req.query.user], function(err, results){
                        if(err){
                            console.log('staff.js: Unable to query for user information; /staff/portal/detailedprofile');
                            return next ({no: 500, msg: 'Unable to query for user information'}, null);
                        }
                        else if(results.length === 0){
                            console.log('staff.js: User does not exist; /staff/portal/detailedprofile');
                            return next ({no: 500, msg: 'No user with that username.'}, null);
                        }
                        else{
                            response.user_info = results[0];
                            next(null, results[0].user_id);
                        }
                    });
                },

                function(userId, next){
                    var sql = 'SELECT school_name, grade, major, esl_level FROM gibson.student WHERE user_id = ?;';

                    con.query(sql, [userId], function(err, results){
                        if(err){
                            console.log('staff.js: Unable to query for student information; /staff/portal/detailedprofile');
                            return next ({no: 500, msg: 'Unable to query for student information'}, null);
                        }
                        else{
                            response.student_info = results[0];
                            next(null, userId);
                        }
                    });
                },

                function(userId, next){
                    var sql = 'SELECT contact_id, lname, fname, relationship, contact_phone FROM gibson.emergency_contact WHERE user_id = ?;';

                    con.query(sql, [userId], function(err, results){
                        if(err){
                            console.log('staff.js: Unable to query for contact information; /staff/portal/detailedprofile');
                            return next ({no: 500, msg: 'Unable to query for contact information'}, null);
                        }
                        else{
                            response.emergency_contacts = results;
                            next(null);
                        }

                    });
                },

                function(next){

                    con.query('SELECT province_id, province_name, prov_abb FROM gibson.province;', function(err, results){
                        if(err){
                            console.log('staff.js: Unable to query for province information; /staff/portal/detailedprofile');
                            return next ({no: 500, msg: 'Unable to query for province information'}, null);
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

// ROUTE FOR EDITING PERSONAL INFORMATION OF A USER
router.post('/staff/portal/edit/personalinfo', function(req, res){

    var sql = 'SELECT user_id FROM gibson.user WHERE username = ? AND rank_id < 3;';
    var inserts = [req.query.user];

    connection.getConnection(function(err,con){
        if(err){
            console.log('staff.js: Cannot get connection.');
            res.status(500).send('Internal Server Error.');
        }
        con.query(sql, function(err, results){

            if(err){
                con.release();
                console.log('staff.js: Cannot get the user profile.');
                res.status(500).send();
            }
            else if(results.length === 0){
                con.release();
                console.log('staff.js: User profile does not exist');
                res.status(404).send('User profile does not exist.');
            }
            else{
                var query = 'UPDATE gibson.user SET fname = ?, lname = ?, primary_phone = ?, secondary_phone = ?, gender = ?, birth_date = ?, address = ?, city = ?, unit_no = ?, province_id = (select province_id from gibson.province where province_name = ?), postal_code = ? WHERE user_id = ?;';
                var inserts = [
                    sanitizer.santize(req.body.fname),
                    sanitizer.santize(req.body.lname),
                    sanitizer.santize(req.body.primary_phone),
                    sanitizer.santize(req.body.secondary_phone),
                    sanitizer.santize(req.body.gender),
                    sanitizer.santize(req.body.birth_date),
                    sanitizer.santize(req.body.address),
                    sanitizer.santize(req.body.city),
                    sanitizer.santize(req.body.unit_no),
                    sanitizer.santize(req.body.province),
                    sanitizer.santize(req.body.postal_code),
                    results[0].user_id
                ];
                query = mysql.format(query, inserts);

                con.query(query, function(err, results){
                    con.release();
                    if(err){
                        console.log('staff.js: Unable to edit personal info.');
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


// ROUTE FOR EDITING STUDENT INFORMATION OF A USER
router.post('/staff/portal/edit/studentinfo', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('adminqueries.js: Cannot get connection.');
            res.status(500).send('Internal Server Error');
        }
        else{

            async.waterfall([

                // QUERYING DATABASE FOR user_id AND student
                function(next){

                    var query = 'SELECT user_id, student FROM gibson.user WHERE username = ? AND rank_id < 3;';

                    con.query(query, [sanitizer.santize(req.query.user)], function(err, results){
                        if(err){
                            return next({msg: 'Error querying for user'});
                        }
                        else if(results.length === 0){
                            return next({msg: 'User profile does not exist'});
                        }
                        else{
                            next(null, results[0]);
                        }
                    });
                },

                // START TRANSACTION WITH THE DATABASE
                function(userInfo, next){

                    con.query('START TRANSACTION;', function(err, results){
                        if(err){
                            return next({msg: 'Error starting transaction with database'});
                        }
                        else{
                            next(null, userInfo);
                        }
                    });
                },

                // IF USER IS A STUDENT -> UPDATE USER'S STUDENT INFO
                function(userInfo, next){
                    if(userInfo.student == 0){
                        next(null, userInfo);
                    }
                    else{

                        var query = 'UPDATE gibson.student SET school_name = ?, grade = ?, major = ?, esl_level = ? WHERE user_id = ?;';
                        var inserts = [
                            sanitizer.sanitize(req.body.schoolname),
                            sanitizer.sanitize(req.body.grade),
                            sanitizer.sanitize(req.body.major),
                            sanitizer.sanitize(req.body.esl),
                            userInfo.user_id
                        ];

                        con.query(query, inserts, function(err, results){
                            if(err){
                                return next({msg: 'Error updating student information'});
                            }
                            else{
                                next(null, userInfo);
                            }
                        });
                    }
                },

                // IF USER IS NOT A STUDENT INSERT NEW ENTRY IN STUDENT TABLE AND UPDATE user TABLE
                function(userInfo, next){
                    if(userInfo.student == 1){
                        next(null, userInfo);
                    }
                    else{

                        var query =  'INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level) VALUES (?,?,?,?,?); ';
                            query += 'UPDATE gibson.user SET student = 1 WHERE user_id =?;';
                        var inserts = [
                            userInfo.user_id,
                            sanitizer.sanitize(req.body.schoolname),
                            sanitizer.sanitize(req.body.grade),
                            sanitizer.sanitize(req.body.major),
                            sanitizer.sanitize(req.body.esl),
                            userInfo.user_id
                        ];

                        con.query(query, inserts, function(err, results){
                            if(err){
                                return next({msg: 'Error updating student information'});
                            }
                            else{
                                next(null, userInfo);
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
                        console.log('staff.js: ' +error.msg +'; /staff/portal/edit/studentinfo');
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

//ROUTE FOR VIEWING DETAILED COURSE
router.get('/staff/portal/detailedcourse', function (req, res, next){
    res.render('detailedcourse', { title: 'Staff Portal'});
});

//GET COURSE DATA TO DISPLAY
router.get('/staff/portal/detailedcourse/data', function (req, res, next){
    connection.getConnection(function (err, con){
        if(err){
            res.status(500).send();
        }
        else{
            async.parallel([
                function (next){
                    async.waterfall([
                        function (callback){
                            var sql = "SELECT course_id, course_code, course_name, instructor_username, instructor_name, default_fee, course_limit, DATE_FORMAT(start_date, '%M %D, %Y') start_date, DATE_FORMAT(end_date, '%M %D, %Y') end_date, course_interval, course_language, course_days, course_target, course_description, instructor_bio, categories, notes FROM gibson.course WHERE course_id = ?;";
                            con.query(sql,[req.query.course], function (err, results){
                                if(err){
                                    return callback(err, null);
                                }
                                else{
                                    callback(null, results[0]);
                                }
                            });
                        },
                        function (course, callback){
                            var sql = "SELECT category_id, category_string, category_type FROM gibson.category_matrix WHERE category_id IN (?);";
                            var inserts = [JSON.parse(course.categories)];
                            sql = mysql.format(sql, inserts);
                            con.query(sql, function (err, results){
                                if(err){
                                    return callback (err, null, null);
                                }
                                else{
                                    callback (null, course, results);
                                }
                            });
                        }
                        ],function (err, course, results){
                           if(err){
                                return next(err, null);
                           }
                           else{
                                next(null, {course:course, categories:results});
                           }
                    });
                },
                function (next){
                    var sql = "SELECT category_id, category_string, category_type FROM gibson.category_matrix;"
                    con.query(sql, function (err, results){
                        if(err){
                            return next(err, null);
                        }
                        else{
                            next(null, results);
                        }
                    });
                },
                function (next){
                    var sql = "SELECT u.username,u.fname,u.lname,u.gender,u.address,u.primary_phone,u.primary_extension,u.secondary_phone,u.secondary_extension,u.email FROM gibson.user u INNER JOIN gibson.user_course uc ON u.user_id = uc.user_id WHERE uc.course_id = ?;";
                    con.query(sql, [req.query.course], function (err, results){
                        if(err){
                            return next(err, null);
                        }
                        else{
                            next(null, results);
                        }
                    });
                },
                function (next){
                    var sql = "SELECT DATE_FORMAT(cd.date, '%d') as day, DATE_FORMAT(cd.date, '%M') as month, TIME_FORMAT(cd.start_time, '%h:%i %p') as start_time, TIME_FORMAT(cd.end_time, '%h:%i %p') as end_time FROM gibson.course_days cd INNER JOIN gibson.course c ON c.course_id = cd.course_id WHERE cd.course_id = ?;";
                    con.query(sql, [req.query.course], function (err, results){
                        if(err){
                            return next(err, null);
                        }
                        else{
                            next(null, results);
                        }
                    });
                }
                ],
                function (err, results){
                    con.release();
                    if(err){
                        console.log(err);
                        res.status(500).send();
                    }
                    else{
                        res.status(200).send(results);
                    }
            });
        }
    });
});

router.post('/staff/portal/detailedcourse/updateTags',function(req, res, next){
    var sql = "UPDATE gibson.course SET categories = JSON_ARRAY(?) WHERE course_id = ?;";
    var inserts = [Array.from(new Set(JSON.parse(req.body.categories))), Number(req.body.course_id)];
    sql = mysql.format(sql, inserts);
    connection.getConnection(function (err, con){
        if(err){
            console.log(err);
            res.status(500).send();
        }
        else{
            con.query(sql, function (err, results){
                con.release();
                if(err){
                    console.log(err);
                    res.status(500).send();
                }
                else{
                    res.status(200).send();
                }
            });
        }
    });
});

// ROUTE FOR VALIDATING INFORMATION WHILE ADDING COURSE.
router.post('/staff/portal/validateCourse', function(req, res){
    async.waterfall([

        //Check if selected courses is in the database
        function(next){
            if(JSON.parse(req.body.selectedtags).length === 0){
                next();
            }
            else{
                connection.getConnection(function(err, con){
                    if(err){
                        console.log('staff.js: Error connecting to database; /staff/portal/validateCourse');
                        res.status(500).send('Internal Server Error');
                    }
                    else{
                        var selectedTags = JSON.parse(req.body.selectedtags);
                        var query = mysql.format('SELECT COUNT(*) AS tag_count FROM gibson.category_matrix WHERE category_id IN (?);', [selectedTags]);

                        con.query(query, function(err, results){
                            if(err && selectedTags.length > 0){
                                return next(new Error('Error counting course tags.'), null);
                            }
                            else if(results[0].tag_count != selectedTags.length){
                                return next(new Error('One or more of the selected tags does not exist.'), null);
                            }
                            else{
                                next();
                            }
                        });
                    }
                });
            }
        },

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
						//console.log("adminqueries.js:Checked Course name/code is unique");
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
						//console.log("adminqueries.js:Checked cost, target, description, Languages");
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
			//console.log("Checked Instructor info (?)");
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
				//console.log(req.body.addinterval);
                return next(new Error("No Interval field selected!"), null);
			}
            else if(!checkSchedule(course_days)){
				//console.log("adminqueries.js:Checking scheduled days");
                return next(new Error("Bad schedule field found!"), null);
            }
			else if (!checkSchedule(adhoc_days)) {
				//console.log("adminqueries.js:Checking ad-hoc days");
				return next(new Error("Bad ad-hoc day field found!"), null);
			}
            else{
				//console.log("Checked start & end date, interval, scheduled days");
                next();
            }
        }

        ],

        function(err, results){
            if(err){
                console.log("adminqueries.js:"+err.message);
                res.status(400).send(err.message);
            }
            else{
                //console.log("adminqueries.js: Validated " + req.body.course_name + "!");
                res.status(200).send("Validated!");
            }
        });
});


// ROUTE FOR ADDING NEW EVENTS
router.post('/staff/portal/addEvent', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('staff.js: Error connecting to the database; /staff/portal/addEvent');
            res.status(500).send('Internal Server Error');
        }
        else{
            var startDate = sanitizer.sanitize(req.body.startdate) +' 00:00:00';
            var endDate = sanitizer.sanitize(req.body.enddate) +' 00:00:00';

            var query = 'INSERT INTO gibson.website_alert (init_date, end_date, alert_msg, alert_type, start_alert) ';
                query +='VALUES(?, ?, ?, ?, 0)';

            query = mysql.format(query, [startDate, endDate, sanitizer.sanitize(req.body.message), sanitizer.sanitize(req.body.eventtype)]);

            con.query(query, function(err, result){
                con.release();

                if(err){
                    console.log('adminqueries.js: Unable to add new event.');
                    res.status(500).send('Unable to add new event.');
                }
                else{
                    res.status(200).send('Event created.');
                }
            });
        }
    });
});


// ROUTE FOR ADDING NEW TAGS
router.post('/staff/portal/addTag', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('staff.js: Error connecting to database; /staff/portal/addTag');
            res.status(500).send('Internal Server Error');
        }
        else if(req.body.category_string && req.body.category_type){

            var query = 'INSERT INTO gibson.category_matrix (category_string, category_type) VALUES (?, ?);';
            var inserts = [sanitizer.sanitize(req.body.category_string), sanitizer.sanitize(req.body.category_type)];

            con.query(query, inserts, function(err, results){
                if(err){
                    console.log('staff.js: Error inserting tag; /staff/portal/addTag');
                    res.status(500).send('Unable to add tag.');
                }
                else{
                    res.status(200).send('Tag added.');
                }
            });
        }
        else{
            res.status(500).send('Nothing to add.');
        }
    });
});


// ROUTE FOR REMOVING TAGS
router.post('/staff/portal/removeTag', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('staff.js: Error connecting to database; /staff/portal/removeTag');
            res.status(500).send('Internal Server Error');
        }
        else{

            // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS
            async.waterfall([

                // QUERY FOR COURSE TAGS
                function(next){
                    con.query('SELECT course_id, categories FROM gibson.course;', function(err, results){
                        if(err){
                            return next({msg: 'Error querying for course tags'});
                        }
                        else{
                            next(null, results);
                        }
                    });
                },

                // STARTS TRANSACTION
                function (all_tags, next){
                    con.query('START TRANSACTION;', function(err, results){
                        if(err){
                            return next({msg: 'Error starting transaction'});
                        }
                        else{
                            next(null, all_tags);
                        }
                    });
                },

                // DIFFERENCE OF SETS -> QUERY GENERATION -> TOO MUCH MATH FOR ME
                function(all_tags, next){

                    var length1, element, i, j;
                    var deleteTags = JSON.parse(req.body.tag_list);
                    var length2 = deleteTags.length;
                    var query = '';
                    var difference = [];
                    var course_count = all_tags.length;
                    var hash_table = {};

                    // DIFFERENCE OF SETS
                    for(i = 0; i < length2; i++){
                        hash_table[deleteTags[i]] = true;
                    }

                    for (i = 0; i < course_count; i++){

                        // RESETTING VALUES AT EACH ITERATION
                        array1 = JSON.parse(all_tags[i].categories);
                        length1 = array1.length;
                        difference = [];

                        for(j = 0; j < length1; j++){
                            element = array1[j];

                            if(!(element in hash_table)){
                                difference.push(Number(element));
                            }
                        }

                        // GENERATING QUERY
                        if(difference.length < length1){
                            query += mysql.format('UPDATE gibson.course SET categories = JSON_ARRAY(?) WHERE course_id = ?;\n', [difference, all_tags[i].course_id]);
                        }
                    }
                    query = query.slice(0, -1);

                    next(null, query, deleteTags);
                },

                // UPDATING THE COURSE TABLE
                function(query, deleteTags, next){
                    if(query == ''){
                        next(null, deleteTags);
                    }
                    else{
                        con.query(query, function(err, results){
                            if(err){
                                return next({msg: 'Error updating courses'});
                            }
                            else{
                                next(null, deleteTags);
                            }
                        });
                    }
                },

                // DELETING TAGS IN THE CATEGORY MATRIX TABLE
                function(deleteTags, next){

                    var query = '';

                    for(var i = 0; i < deleteTags.length; i++){
                        query += mysql.format('DELETE FROM gibson.category_matrix WHERE category_id = ?;\n', [Number(deleteTags[i])]);
                    }
                    query = query.slice(0, -1);


                    con.query(query, function(err, results){
                        if(err){
                            return next({msg: 'Error deleting tags'});
                        }
                        else{
                            next(null);
                        }
                    });
                }
            ],

            // FINAL FUNCTION HANDLES ERROR/SUCCESS
            function(err){
                if(err){
                    console.log('staff.js: ' +err.msg +'; /staff/portal/removeTag');
                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        res.status(500).send('Error removing tags.');
                    });
                }
                else{
                    con.query('COMMIT;', function(err, results){
                        con.release();
                        res.status(200).send('Selected tags removed.');
                    });
                }
            });
        }
    });
});


// ROUTE FOR ADDING NEW COURSE
router.post('/staff/portal/addCourse', function(req, res){
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

    var selectedTags = JSON.parse(req.body.selectedtags);
    var categories = [];

    for(var i = 0; i < selectedTags.length; i++){
        categories.push(Number(selectedTags[i]));
    }

    var inserts = [
        req.body.addcoursecode,
        req.body.addcoursename,
        req.body.instructor_username,
        req.body.instructor_name,
        req.body.addcost,
        req.body.course_limit,
        req.body.addstartdate,
        req.body.addenddate,
        req.body.addinterval,
        req.body.addtarget,
        req.body.adddescription,
        req.body.instructor_bio,
        categories,
        req.body.notes
    ];

    sql = mysql.format(sql, inserts);
    sql = sql.replace('language_dml', language_dml);
    sql = sql.replace('course_days_dml', course_days_dml);

    connection.getConnection(function(err,con){
        if(err){
            con.release();
            console.log("adminqueries.js: cannot get connection");
            res.status(500).send();
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
                con.query(sql, function(err, results){
                    if(err){
                        console.log("adminqueries.js: Query error for inserting course to database");
                        return next(err);
                    }
                    next(null, results.insertId);
                });
            },

            function (course_id, next){
                if(adminFunctions.getScheduledDays(course_id, req.body.addstartdate, req.body.addenddate, req.body.addinterval, course_days)){
                    return new Error('Error adding course schedule');
                }
                next(null, course_id);
            },

			function (course_id, next) {
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
					res.status(500).send();
                });
            }

            else{
                con.query("COMMIT;", function(err, results){
                    con.release();
					res.send("Add course complete!");
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
    return adhoc_days_dml;
}

//TODO: REDO
function checkSchedule(course_days){
	var faulty = false;
	for (var i = course_days.length - 1; i >= 0; i--){
		if (course_days[i].day == '' || course_days[i].day == null) {
			faulty = true;
			//console.log("adminqueries.js: schedule " + i + "'s day is not filled in!");
		}
		if (course_days[i].start_time == '' || course_days[i].start_time == null) {
			faulty = true;
			//console.log("adminqueries.js: schedule " + i + "'s start_time is not filled in!");
		}
		if (course_days[i].end_time == '' || course_days[i].end_time == null) {
			faulty = true;
			//console.log("adminqueries.js: schedule " + i + "'s end time is not filled in!");
		}
		if (faulty) return false;
	}
	return true;
}


// ROUTE FOR GRABBING COURSE INFORMATION FOR MODIFYING COURSES.


module.exports = router;
