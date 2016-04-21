var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');


// ROUTE FOR VALIDATING USERNAME.
router.post('/volunteer/adduser/checkusername', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/adduser/checkusername');
            res.status(500).sent('Internal Server Error.');
        }
        else{

            // CHECKING IF USERNAME ALREADY EXIST
            con.query('SELECT user_id FROM gibson.user WHERE username = ?;', [req.body.username], function(err, results){

                con.release();

                if(err){
                    console.log('volunteer.js: Error querying for user_id; /volunteer/adduser/validateusername');
                    res.status(500).send('Internal Server Error.');
                }
                else if (results.length > 0){
                    res.status(500).send('Username already taken.');
                }
                else{
                    res.status(200).send('Good username.');
                }
            });
        }
    });
});

// ROUTE FOR VALIDATING EMAIL.
router.post('/volunteer/adduser/checkemail', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('volunteer.js: Error connecting to database; /volunteer/adduser/checkusername');
            res.status(500).sent('Internal Server Error.');
        }
        else{

            // CHECKING IF USERNAME ALREADY EXIST
            con.query('SELECT email FROM gibson.user WHERE username = ?;', [req.body.username], function(err, results){

                con.release();

                if(err){
                    console.log('volunteer.js: Error querying for email; /volunteer/adduser/validateusername');
                    res.status(500).send('Internal Server Error.');
                }
                else if (results.length > 0){
                    res.status(500).send('Email already taken.');
                }
                else{
                    res.status(200).send('Good email.');
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
            res.status(500).sent('Internal Server Error.');
        }
        else{

            // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS
            async.waterfall([

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
                    var newUser = {
                      username:null, password:null, lname:null, fname:null, birth_date:null, gender:null,
                      address:null, unit_no:null, city:null, province_id:null, postal_code:null,
                      primary_phone:null, primary_extension:null, secondary_phone:null, secondary_extension:null,
                      email:null, send_notification:null, student:null, user_id:null
                    };

                    // INITIALIZING newUser VALUES
                    newUser.username = req.body.username;
                    newUser.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(Math.floor(3*Math.random())+10));
                    newUser.lname = req.body.lname;
                    newUser.fname = req.body.fname;
                    newUser.birth_date = req.body.birth_date;
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
                    var createUser  = 'INSERT INTO gibson.user (rank_id, type, username, password, lname, fname, birth_date, gender, address, ';
                        createUser +=                               'unit_no, city, province_id, postal_code, primary_phone, primary_extension, ';
                        createUser +=                               'secondary_phone, secondary_extension, email, send_notification, student) ';
                        createUser += 'VALUES(1, "REGULAR", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                    var values = [
                      newUser.username, newUser.password, newUser.lname, newUser.fname, newUser.birth_date, newUser.gender, newUser.address,
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
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, '')],
                        [userId, req.body.emergencylname2, req.body.emergencyfname2, req.body.relationship2, req.body.ephone2.replace(/\D+/g, '')],
                        [userId, req.body.emergencylname3, req.body.emergencyfname3, req.body.relationship3, req.body.ephone3.replace(/\D+/g, '')]
                      ];
                    }
                    else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
                      emContacts = [
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, '')],
                        [userId, req.body.emergencylname2, req.body.emergencyfname2, req.body.relationship2, req.body.ephone2.replace(/\D+/g, '')]
                      ];
                    }
                    else{
                      emContacts = [
                        [userId, req.body.emergencylname1, req.body.emergencyfname1, req.body.relationship1, req.body.ephone1.replace(/\D+/g, '')]
                      ];
                    }

                    // GENERATING THE INSERT QUERY
                    var insertEmContacts = '';
                    for (var ecnum = 0; ecnum < emContacts.length; ecnum++){
                      insertEmContacts += mysql.format('INSERT INTO gibson.emergency_contact (user_id, lname, fname, relationship, contact_phone) VALUES(?, ?, ?, ?, ?); ', emContacts[ecnum]);
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

                        var createStudent = 'INSERT INTO gibson.temp_student (user_id, school_name, grade, major, esl_level)';
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
            function(err){
                if(err){
                    con.query('ROLLBACK;', function(err, results){
                        con.release();
                        console.log('volunteer.js: ' +err.msg +'; /volunteer/adduser');
                        res.status(err.no).send('UNABLE TO ADD USER.');
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
            res.status(500).sent('Internal Server Error.');
        }
        else{

            var query =  'INSERT INTO gibson.user ';
                query += '(type, lname, fname, primary_phone, primary_extension, secondary_phone, secondary_extension, send_notifications) ';
                query += '(?, ?, ?, ?, ?, ?, ?, 1);';

            var inserts = ['LIMITED', req.body.lname, req.body.fname, req.body.primary_phone, req.body.primary_extension,
                           req.body.secondary_phone, req.body.secondary_extension];

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


module.exports = router;
