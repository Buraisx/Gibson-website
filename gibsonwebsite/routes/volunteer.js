var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');


// RENDERS VOLUNTEER PAGE
router.get('/volunteer/portal', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error getting connection; /volunteer/portal');
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
                    var sql = "SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group;"
                    con.query(sql, function (err, results){
                        next(err, results);
                    });
                }
            },
            //Return results
            function (err, results){
                con.release();
                if(err){
                    console.log('volunteer.js: Database Query failed');
                    res.status(500).send("Failure");
                }
                else{
                    res.render('volunteerview', { title: 'Volunteer Portal', province_list: results.province_list, age_group_list: results.age_group_list, MAX: 3});
                }
            });
        }
    });
});


// GET ALL USERS
router.get('/volunteer/portal/info', function(req, res) {

    var sql = 'SELECT fname, lname, username, email, primary_phone, primary_extension, secondary_phone, secondary_extension, gender, address, send_notification, student, age_group_name, age_group_description FROM gibson.user u INNER JOIN gibson.age_group a ON u.age_group_id=a.age_group_id;';


    connection.getConnection(function(err, con) {
        if(err) {
          console.log('volunteer.js: Cannot get connection to database; /volunteer/portal/info');
          res.status(500).send('Internal Server Error');
        }
        else{
            con.query(sql, function(err, results){
                con.release();

                if(err) {
                    console.log('volunteer.js: Query error for finding user info; /staff/portal/info');
                    res.status(500).send({msg: 'Error querying DB for users.'});
                }
                else{
                    res.send(results);
                }
            });
        }
    });
});


// ENROLLING USER/L.USER INTO COURSE
router.post('/volunteer/enrolluser', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/enrolluser');
            res.status(500).send('Internal Server Error.');
        }
        else{
            async.waterfall([

                // STARTS TRANSACTION WITH THE DATABASE
                function(next){
                    con.query('START TRANSACTION;', function(err, con){
                        if(err){
                            return next({msg: 'Error starting transaction'});
                        }
                        else{
                            next(null);
                        }
                    });
                },

                // GENERATE DESCRIPTION
                function(next){

                    var query = 'SELECT course_code FROM gibson.course WHERE course_id IN (course_ids);';
                    var course_ids = '';

                    for(var i in req.body.course_ids){
                        course_ids += mysql.escape(req.body.course_ids[i]) + ', ';
                    }

                    course_ids = course_ids.slice(0, -2);
                    query = query.replace('course_ids', course_ids);

                    con.query(query, function(err, results){
                        if(err){
                            return next({msg: 'Error querying for course codes'});
                        }
                        else if (results.length === 0){
                            return next({msg: 'No course codes found'});
                        }
                        else{

                            var description = 'Signup fee for course(s): ';

                            for (var i in results){
                                description += results[i].course_code +', ';
                            }

                            next(null, description.slice(0, -2))
                        }
                    });
                },

                // INSERTING PAYMENT HISTORY
                function(description, next){

                    var query  = 'INSERT INTO gibson.transaction_history (payment_id, state, intent, payment_method, user_id, payer_email, payer_first_name, payer_last_name, total, currency, description) ';
                        query += 'SELECT ?, "approved", "sale", ?, user.user_id, user.email, user.fname, user.lname, ? , "CAD", ? ';
                        query += 'FROM gibson.user WHERE user_id = ?;';

                    var inserts = [
                        sanitizer.sanitize(req.body.payment_id),
                        sanitizer.sanitize(req.body.payment_method),
                        sanitizer.sanitize(req.body.total),
                        description,
                        sanitizer.sanitize(req.body.user_id)
                    ];

                    con.query(query, inserts, function(err, results){
                        if(err){
                            return next({msg: 'Error inserting payment history'});
                        }
                        else{
                            next(results.insertId, sanitizer.sanitize(req.body.total));
                        }
                    });
                },

                // INSERTING USER INTO COURSE(S)
                function(transaction_id, total, next){

                    var query =  'INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, transaction_id, start_date, end_date, status, notes) ';
                        query += 'SELECT ?, course.course_id, ?, course.default_fee, ?, 1, ?, course.start_date, course.end_date, "Enrolled", ? ';
                        query += 'FROM gibson.course WHERE course_id = ?; ';

                    var multiQuery = '';

                    for (var i in req.body.course_list){

                        var today = new Date().toJSON().slice(0,10);
                        var notes = 'Registered for course ID: ' +sanitizer.sanitize(req.body.course_list[i]);

                        var inserts = [
                            sanitizer.sanitize(req.body.user_id),
                            today,
                            total,
                            transaction_id,
                            notes,
                            sanitizer.sanitize(req.body.course_list[i])
                        ];

                        multiQuery += mysql.format(query, inserts);
                    }

                    con.query(multiQuery, function(err, results){
                        if(err){
                            return next({msg: 'Error inserting user into course(s)'});
                        }
                        else{
                            next (null);
                        }
                    });
                }
            ],

            // FINAL FUNCTION -> HANDLES ERROR/SUCCESS
            function(error){
                if(error){
                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        console.log('volunteer.js: ' +error.msg +'; /volunteer/enrolluser');
                        res.status(500).send('Failed to enroll user.');
                    });
                }
                else{
                    con.query('COMMIT;', function(err, results){
                        con.release();
                        res.status(200).send('User enrolled into course.');
                    });
                }
            });
        }
    });
});


// ROUTE FOR CREATING A NEW USER TO THE WEBSITE.
router.post('/volunteer/adduser', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/adduser/checkusername');
            res.status(500).send('Internal Server Error.');
        }
        else{

            // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS
            async.waterfall([

                // VALIDATING INPUT
                function(next){
                    if (req.body.username == "" ||
                        req.body.password == "" ||
                        req.body.gender == "" ||
                        req.body.address == "" ||
                        req.body.city == "" ||
                        req.body.postal_code == "" ||
                        req.body.province == "" ||
                        req.body.emergencyfname1 == "" ||
                        req.body.emergencylname1 == "" ||
                        req.body.relationship1 == "" ||
                        req.body.ephone1 == ""){
                            return next({no: 400, msg:'Bad input'});
                        }
                    else if (req.body.student == "1" && (req.body.schoolname == "" || req.body.grade == "")){
                        return next({no: 400, msg:'Bad input'});
                    }
                    else{
                        next(null);
                    }
                },

                // STARTING TRANSACTION
                function(next){
                    con.query('START TRANSACTION;', function(err, results){
                        if(err){
                            return next({no: 500, msg:'Error starting transaction.'});
                        }
                        else{
                            next(null);
                        }
                    });
                },

                // INSERTING USER INTO PERMANENT TABLE
                function(next){

                    for(var i in req.body){
                        req.body[i] = sanitizer.sanitize(req.body[i]);
                    }

                    var newUser = {
                      username:null, password:null, lname:null, fname:null, age_group_id:null, gender:null,
                      address:null, unit_no:null, city:null, province_id:null, postal_code:null,
                      primary_phone:null, primary_extension:null, secondary_phone:null, secondary_extension:null,
                      email:null, send_notification:null, student:null, user_id:null
                    };

                    // INITIALIZING newUser VALUES
                    newUser.username = req.body.username;
                    newUser.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(Math.floor(3*Math.random())+10));
                    newUser.lname = req.body.lname;
                    newUser.fname = req.body.fname;
                    newUser.age_group_id = req.body.age_group_id;
                   // newUser.birth_date = req.body.birth_date;
                    newUser.gender = req.body.gender;
                    newUser.address = req.body.address;
                    newUser.unit_no = req.body.apt;
                    newUser.city = req.body.city;
                    newUser.province_id = req.body.province;
                    newUser.postal_code = req.body.postal_code.toUpperCase().replace(/ /g,''); //Deletes the white space in postal code.
                    newUser.primary_phone = req.body.primary_phone.replace(/\D+/g, ''); //Removes everything, but digits [0-9]
                    newUser.primary_extension = (!req.body.primary_extension)? null:req.body.primary_extension.replace(/\D+/g, '');
                    newUser.secondary_phone = req.body.secondary_phone.replace(/\D+/g, '');
                    newUser.secondary_extension = (!req.body.secondary_extension)? null:req.body.secondary_extension.replace(/\D+/g, '');
                    newUser.email = req.body.email;
                    newUser.send_notification = (!req.body.send_notifications)? 0:req.body.send_notifications;
                    newUser.student = (!req.body.student)? 0:req.body.student;

                    // CREATING QUERY
                    var createUser  = 'INSERT INTO gibson.user (rank_id, type, username, password, lname, fname, age_group_id, gender, address, ';
                        createUser +=                               'unit_no, city, province_id, postal_code, primary_phone, primary_extension, ';
                        createUser +=                               'secondary_phone, secondary_extension, email, send_notification, student) ';
                        createUser += 'VALUES(1, "REGULAR", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                    var values = [
                      newUser.username, newUser.password, newUser.lname, newUser.fname, newUser.age_group_id, newUser.gender, newUser.address,
                      newUser.unit_no, newUser.city, newUser.province_id, newUser.postal_code, newUser.primary_phone, newUser.primary_extension,
                      newUser.secondary_phone, newUser.secondary_extension, newUser.email, newUser.send_notification, newUser.student
                    ];

                    createUser = mysql.format(createUser, values);

                    con.query(createUser, function(err, results){
                        if(err){
                            return next({no: 500, msg:'Error inserting user'});
                        }
                        else{
                            next(null, results.insertId, newUser.student);
                        }
                    });
                },

                // INSERTING EMERGENCY CONTACTS
                function(userId, student, next){
                    var emContacts = [];

                    if(req.body.emergencyfname3 && req.body.emergencylname3 && req.body.relationship3 && req.body.ephone3){
                      emContacts = [
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, ''),req.body.ephoneext1],
                        [userId, req.body.emergencylname2, req.body.emergencyfname2, req.body.relationship2, req.body.ephone2.replace(/\D+/g, ''),req.body.ephoneext2],
                        [userId, req.body.emergencylname3, req.body.emergencyfname3, req.body.relationship3, req.body.ephone3.replace(/\D+/g, ''),req.body.ephoneext3]
                      ];
                    }
                    else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
                      emContacts = [
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, ''),req.body.ephoneext1],
                        [userId, req.body.emergencylname2, req.body.emergencyfname2, req.body.relationship2, req.body.ephone2.replace(/\D+/g, ''),req.body.ephoneext2]
                      ];
                    }
                    else{
                      emContacts = [
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, ''),req.body.ephoneext1]
                      ];
                    }

                    // GENERATING THE INSERT QUERY
                    var insertEmContacts = '';
                    for (var ecnum = 0; ecnum < emContacts.length; ecnum++){
                      insertEmContacts += mysql.format('INSERT INTO gibson.emergency_contact (user_id, lname, fname, relationship, contact_phone, contact_phone_extension) VALUES(?, ?, ?, ?, ?,?); ', emContacts[ecnum]);
                    }

                    con.query(insertEmContacts, function(err, results){
                        if(err){
                            return next({no:500, msg:'Error inserting emergency contacts'})
                        }
                        else{
                            next(null, userId, student);
                        }
                    });
                },

                // INSERTING STUDENT INFORMATION
                function(userId, student, next){
                    if(student == 0){
                        next(null);
                    }
                    else{

                        var studentInfo = {
                            user_id:userId, school_name:null, grade:null, major:null, esl_level:null
                        };

                        studentInfo.school_name = req.body.schoolname;
                        studentInfo.grade = req.body.grade;
                        studentInfo.major = req.body.major;
                        studentInfo.esl_level = req.body.esl;

                        var createStudent = 'INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level)';
                        createStudent += 'VALUES (?,?,?,?,?);';
                        var student_values = [
                            studentInfo.user_id, studentInfo.school_name, studentInfo.grade,
                            studentInfo.major, studentInfo.esl_level
                        ];

                        var studentInsert = mysql.format(createStudent, student_values);

                        con.query(studentInsert, function(err, results){
                            if(err){
                                return next({no:500, msg:'Error inserting student info'});
                            }
                            else{
                                next(null);
                            }
                        });
                    }
                }

            ],

            // FINAL FUNCTION -> HANDLES ERRORS
            function(error){
                if(error){
                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        console.log('volunteer.js: ' +error.msg +'; /volunteer/adduser');
                        res.status(error.no).send('UNABLE TO ADD USER.');
                    });
                }
                else{
                    con.query('COMMIT;', function(err, results){
                        con.release();
                        res.status(200).send('USER CREATED.');
                    });
                }
            });
        }
    });
});

// ROUTE FOR ADDING A LIMITED ACCESS USER.
router.post('/volunteer/addlimited', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/addlimited');
            res.status(500).send('Internal Server Error.');
        }
        else{

            var query =  'INSERT INTO gibson.user ';
                query += '(type, lname, fname, primary_phone, primary_extension, email, send_notification) ';
                query += 'VALUES (?, ?, ?, ?, ?, ?, 1);';

            var inserts = [
                'LIMITED',
                sanitizer.sanitize(req.body.lname),
                sanitizer.sanitize(req.body.fname),
                sanitizer.sanitize(req.body.primary_phone),
                sanitizer.sanitize(req.body.primary_extension),
                sanitizer.sanitize(req.body.email),
            ];

            query = mysql.format(query, inserts);

            con.query(query, function(err, results){

                con.release();

                if(err){
                    console.log('volunteer.js: Error inserting LIMITED user.');
                    res.status(500).send('ERROR CREATING USER.');
                }
                else{
                    res.status(200).send('USER CREATED');
                }
            });
        }
    });
});


// ROUTE FOR SEARCHING A LIMITED USER
router.post('/volunteer/search/limiteduser', function(req, res){

    //GETTING CONNECTION
    connection.getConnection(function(err, con){

        var query = 'SELECT user_id, lname, fname, primary_phone, primary_extension, email FROM gibson.user WHERE email = ? AND type = "LIMITED";';
        query = mysql.format(query, [req.body.email]);

        con.query(query, function(err, results){
            if(err){
                console.log('volunteer.js: Unable to find limited user; /volunteer/search/limiteduser');
                res.status(400).send('Cannot find limited user.');
            }
            else if (!results.length){
                console.log('volunteer.js: Unable to find limited user; /volunteer/search/limiteduser');
                res.status(400).send('Cannot find limited user.');
            }
            else{
                res.status(200).send(results[0]);
            }
        });
    });
});


// ROUTE FOR CONVERTING A LIMITED USER TO A REGULAR USER
router.post('/volunteer/convertlimited', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/convertlimited')
            res.status(500).send();
        }
        else{

            // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS:
            async.waterfall([

                // FUNCTION FOR VALIDATING UPGRADE
                function(next){
                    con.query('SELECT type FROM gibson.user WHERE user_id = ?;', [req.body.user_id], function(err, results){
                        if(err || results.length === 0){
                            return next({no:500, msg:'Unable to find user to convert'});
                        }
                        else if(results[0].type == 'REGULAR'){
                            return next({no:400, msg:"Can't convert user who is not limited"});
                        }
                        else{
                            next(null);
                        }
                    });
                },

                // FUNCTION TO SANITIZE INFO COMING FROM THE FRONT, RETURNS user OBJECT
                function(next){
                    // GENERATING SALT FOR THE HASHING PROCESS
                    bcrypt.genSalt(Math.floor(3*Math.random())+10, function(err, salt){
                        if(err){
                            return next({no:500, msg:'Error generating salt for password'});
                        }
                        else{
                            // HASHING THE PASSWORD
                            bcrypt.hash(sanitizer.sanitize(req.body.password), salt, null, function(err, passwordSaltedHashed){
                                if(err){
                                    return next({no:500, msg:'Error hashing the password'});
                                }
                                else{
                                    var user = {
                                        rank_id: 1,
                                        type: 'REGULAR',
                                        username: sanitizer.sanitize(req.body.username),
                                        password: passwordSaltedHashed,
                                        lname: sanitizer.sanitize(req.body.lname),
                                        fname: sanitizer.sanitize(req.body.fname),
                                        age_group_id: sanitizer.sanitize(req.body.age_group_id),
                                        gender: sanitizer.sanitize(req.body.gender),
                                        address: sanitizer.sanitize(req.body.address),
                                        unit_no: sanitizer.sanitize(req.body.unit_no),
                                        city: sanitizer.sanitize(req.body.city),
                                        province_id: sanitizer.sanitize(req.body.province_id),
                                        postal_code: sanitizer.sanitize(req.body.postal_code).toUpperCase().replace(/ /g,''),
                                        primary_phone: sanitizer.sanitize(req.body.primary_phone).replace(/\D+/g, ''),
                                        primary_extension: sanitizer.sanitize(req.body.primary_extension).replace(/\D+/g, ''),
                                        secondary_phone: sanitizer.sanitize(req.body.secondary_phone).replace(/\D+/g, ''),
                                        secondary_extension: sanitizer.sanitize(req.body.secondary_extension).replace(/\D+/g, ''),
                                        email: sanitizer.sanitize(req.body.email),
                                        send_notification: sanitizer.sanitize(req.body.send_notification),
                                        student: sanitizer.sanitize(req.body.student)
                                    };

                                    next(null, user);
                                }
                            });
                        }
                    });
                },

                // STARTS TRANSACTION WITH THE DATABASE
                function(user, next){
                    con.query('START TRANSACTION;', function(err, results){
                        if(err){
                            return next({no:500, msg:'Error starting transaction'});
                        }
                        else{
                            next(null, user);
                        }
                    });
                },

                // UPDATE DATABASE WITH NEW INFORMATION
                function(user, next){
                    var query = 'UPDATE gibson.user SET rank_id=?, type=?, username=?, password=?, lname=?, fname=?, age_group_id=?, gender=?, address=?, unit_no=?, city=?, province_id=?, postal_code=?, primary_phone=?, primary_extension=?, secondary_phone=?, secondary_extension=?, email=?, send_notification=?, student=? WHERE user_id = ?;';
                    var inserts = [user.rank_id, user.type, user.username, user.password, user.lname, user.fname, user.age_group_id, user.gender, user.address, user.unit_no, user.city, user.province_id, user.postal_code, user.primary_phone, user.primary_extension, user.secondary_phone, user.secondary_extension, user.email, user.send_notification, user.student, req.body.user_id];
                    query = mysql.format(query, inserts);

                    con.query(query, function(err, results){
                        if(err){
                            return next({no:500, msg:'Error updating user information'});
                        }
                        else{
                            next(null, user.student);
                        }
                    });
                },

                // CREATE STUDENT ENTRY IN STUDENT TABLE IF USER IS A STUDENT
                function(student, next){
                    if(student == 0){
                        next(null);
                    }
                    else if (student == 1){
                        query = 'INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level) VALUES (?, ?, ?, ?, ?);';
                        inserts = [req.body.user_id, sanitizer.sanitize(req.body.school_name), sanitizer.sanitize(req.body.grade), sanitizer.sanitize(req.body.major), sanitizer.sanitize(req.body.esl_level)];

                        con.query(query, inserts, function(err, results){
                            if(err){
                                return next({no:500, msg:'Error inserting student information'});
                            }
                            else{
                                next(null);
                            }
                        });
                    }
                    else{
                        return next({no:500, msg:'student is not 0 or 1... You dun goofed, son'});
                    }
                },

                // INSERT EMERGENCY CONTACTS INFORMATION
                function(next){

                    // SOME FINE HARDCODING
                    var emContacts = [];

                    if(req.body.emergencyfname3 && req.body.emergencylname3 && req.body.relationship3 && req.body.ephone3){
                      emContacts = [
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, '')],
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname2), sanitizer.sanitize(req.body.emergencyfname2), sanitizer.sanitize(req.body.relationship2), sanitizer.sanitize(req.body.ephone2).replace(/\D+/g, '')],
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname3), sanitizer.sanitize(req.body.emergencyfname3), sanitizer.sanitize(req.body.relationship3), sanitizer.sanitize(req.body.ephone3).replace(/\D+/g, '')]
                      ];
                    }
                    else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
                      emContacts = [
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, '')],
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname2), sanitizer.sanitize(req.body.emergencyfname2), sanitizer.sanitize(req.body.relationship2), sanitizer.sanitize(req.body.ephone2).replace(/\D+/g, '')]
                      ];
                    }
                    else{
                      emContacts = [
                        [req.body.user_id, sanitizer.sanitize(req.body.emergencylname1), sanitizer.sanitize(req.body.emergencyfname1), sanitizer.sanitize(req.body.relationship1), sanitizer.sanitize(req.body.ephone1).replace(/\D+/g, '')]
                      ];
                    }

                    // GENERATING THE INSERT QUERY
                    var insertEmContacts = '';
                    for (var ecnum = 0; ecnum < emContacts.length; ecnum++){
                      insertEmContacts += mysql.format('INSERT INTO gibson.emergency_contact (user_id, lname, fname, relationship, contact_phone) VALUES(?, ?, ?, ?, ?); ', emContacts[ecnum]);
                    }

                    con.query(insertEmContacts, function(err, results){
                        if(err){
                            return next({no:500, msg:'Error inserting emeregency contacts'});
                        }
                        else{
                            next(null);
                        }
                    });
                }
            ],

            // FINAL FUNCTION -> HANDLES ERROR
            function(err){
                if(err){
                    console.log('volunteer.js: ' +err.msg +'; volunteer/convertlimited')

                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        res.status(500).send('Error converting user to regular user.');
                    });
                }
                else{
                    con.query('COMMIT;', function(err, results){
                        con.release();
                        res.status(200).send('User converted successfully.');
                    });
                }
            });
        }
    });
});


// GETTING A LIST OF COURSES
router.get('/volunteer/portal/courses', function(req, res){

    var sql = "SELECT course_id, course_name, course_code, default_fee, start_date, end_date, course_time, categories, course_interval, course_language, course_target, course_description, notes, course_days, course_limit, (SELECT COUNT(*) FROM user_course uc WHERE uc.course_id=co.course_id) AS enroll_count FROM gibson.course co ORDER BY course_id DESC;";

    connection.getConnection(function(err, con){
        if(err){
            console.log("adminqueries.js: Cannot get connection");
            res.status(500).send();
        }

        con.query(sql, function(err, results){
            con.release();

            if(err){
                console.log("volunteer.js: Query error for finding courses");
                res.status(500).send();
            }
            else if(!results.length){
                console.log("volunteer.js: No courses found!");
            }
            else{
                res.send(results);
            }
        });
    });
});


// SENDS A LIST OF STUDENTS
router.get('/volunteer/portal/courses/students', function(req, res){

    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to the database.');
            res.status(500).send("Internal Server Error");
        }
        else{

            var query =  'SELECT user.user_id, user.username, user.fname, user.lname, user.email ';
                query += 'FROM gibson.user INNER JOIN gibson.user_course ';
                query += 'ON user_course.user_id = user.user_id ';
                query += 'WHERE user_course.course_id = ?;';

            con.query(query, [sanitizer.sanitize(req.query.course_id)], function(err, results){
                con.release();

                if(err){
                    console.log("volunteer.js: Error querying for list of students.");
                    res.status(500).send("Internal Server Error.");
                }
                else{
                    res.status(200).send(results);
                }
            });
        }
    });
});



module.exports = router;
