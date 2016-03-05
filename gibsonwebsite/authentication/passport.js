var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var config = require('../server_config');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');
var async = require('async');

// SETUP POOLING CONNECTION
config.db_config.multipleStatements = true;
var connection = mysql.createPool(config.db_config);

// TESTING THE CONNECTION TO THE DB
connection.getConnection(function(err, con){
    if(err)
      console.log('passport.js: Error connecting to the database.');
    else
      console.log('passport.js: Connection to database established.');

    return;
});

module.exports = function(passport){

  // SERIALIZES USER - USED FOR SESSION -> NOT USED SINCE SWITCHED TO TOKENS
  // KEEPING THIS HERE TO USE LATER WITH FACEBOOK LOGIN(?)
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  // DESERIALIZE USER
  passport.deserializeUser(function(id, done) {

    var sql = "SELECT * FROM gibson.user WHERE username = ?";
    var inserts = [id];
    sql = mysql.format(sql, inserts);
    console.log(sql);

    // QUERY TO LOOK FOR THE USER WITH THE SERIALIZED USERNAME
    connection.getConnection(function(err, con){
      con.query(sql,function(err, results){
        con.release();
        done(err, results[0]);
      });
    });
  });

// ==============================
// ======== LOCAL SIGNUP ========
// ==============================
  passport.use('local-signup', new LocalStrategy({

    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, username, password, done){

    // SANITIZES EVERYTHING COMING IN FROM REQ
    for(var i in req.body){
      req.body[i] = sanitizer.sanitize(req.body[i]);
    }

    var sql = "SELECT * FROM ?? WHERE ?? = ?;";
    var inserts = ['gibson.user', 'username', req.body.username];
    sql = mysql.format(sql, inserts);

    //GET POOLING CONNECTION
    connection.getConnection(function(err, con){

      //======================================
      //=== CHECKING IF USER ALREADY EXIST ===
      //======================================
      con.query(sql, function(err, results){

        // ERROR WHILE QUERYING THE DB
        if(err){
          con.release();
          console.log('Local-Signup: Error while checking if username is already taken.');
          return done(err);
        }
        // USER WITH THAT USERNAME FOUND
        if(results.length){
          con.release();
          console.log('User already exist with that username or email.');
          return done(null, false );
          //req.flash('signupMessage', 'User already exist with that email')
        }

        // CHECKING IF THE USER IS ALREADY IN THE TEMPORARY TABLE
        con.query('SELECT * FROM gibson.temp_user WHERE username = ?;', [req.username], function (err, results){
          if (err){
            con.release();
            console.log ('passport.js: Error querying temporary user table; local-signup');
            return done(err);
          }

          // USER IS A TEMPORARY USER AND ALREADY EXIST IN THE DATABASE.
          if (results.length){
            con.release();
            console.log('User already exist in the temporary user table.');
            return done (null, false);
          }

          //=======================================
          //=== USER NOT FOUND -> MAKE NEW USER ===
          //=======================================
          else{
            var newUser = {
              username:null, password:null, lname:null, fname:null, birth_date:null,
              gender:null, address:null, unit_no:null, city:null, province_id:null,
              postal_code:null, primary_phone:null, secondary_phone:null, email:null,
              send_notification:null, student:null, user_id:null
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
            newUser.postal_code = req.body.postal_code.replace(/ /g,''); //Deletes the white space in postal code.
            newUser.primary_phone = req.body.primary_phone;
            newUser.secondary_phone = req.body.secondary_phone;
            newUser.email = req.body.email;
            newUser.send_notification = (!req.body.send_notifications)? 0:req.body.send_notifications;
            newUser.student = (!req.body.student)? 0:req.body.student;

            // CREATING QUERY
            var createUser  = 'INSERT INTO gibson.temp_user (rank_id, username, password, lname, fname, birth_date, gender, address, unit_no, ';
                createUser +=                               'city, province_id, postal_code, primary_phone, secondary_phone, email, ';
                createUser +=                               'send_notification, student) ';
                createUser += 'VALUES(1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
            var values = [
              newUser.username, newUser.password, newUser.lname, newUser.fname, newUser.birth_date, newUser.gender,
              newUser.address, newUser.unit_no, newUser.city, newUser.province_id, newUser.postal_code, newUser.primary_phone,
              newUser.secondary_phone, newUser.email, newUser.send_notification, newUser.student
            ];

            createUser = mysql.format(createUser, values);

            // INSERTING NEW USER INTO DATABASE
            con.query(createUser, function(err, results){
              if(err){
                con.release();
                console.log('passport.js: Error while inserting new user into the database.');
                console.log(results);
                return done(err);
              }
              // user_id OF THE INSERTED USER
              var userId = results.insertId;

              //==========================================================================
              //=== INSERT NEW USER'S EMERGENCY CONTACTS TO EMERGENCY_CONTACT DATABASE ===
              //==========================================================================

              // SOME FINE HARDCODING
              var emContacts = [];

              if(req.body.emergencyfname3 && req.body.emergencylname3 && req.body.relationship3 && req.body.ephone3){
                emContacts = [
                  [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1],
                  [userId, req.body.emergencyfname2, req.body.emergencylname2, req.body.relationship2, req.body.ephone2],
                  [userId, req.body.emergencyfname3, req.body.emergencylname3, req.body.relationship3, req.body.ephone3]
                ];
              }
              else if (req.body.emergencyfname2 && req.body.emergencylname2 && req.body.relationship2 && req.body.ephone2){
                emContacts = [
                  [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1],
                  [userId, req.body.emergencyfname2, req.body.emergencylname2, req.body.relationship2, req.body.ephone2]
                ];
              }
              else{
                emContacts = [
                  [userId, req.body.emergencyfname1, req.body.emergencylname1, req.body.relationship1, req.body.ephone1]
                ];
              }

              // GENERATING THE INSERT QUERY
              var insertEmContacts = '';
              for (var ecnum = 0; ecnum < emContacts.length; ecnum++){
                insertEmContacts += mysql.format('INSERT INTO gibson.temp_emergency_contact (user_id, lname, fname, relationship, contact_phone) VALUES(?, ?, ?, ?, ?); ', emContacts[ecnum]);
              }

              // QUERYING TO INSERT EMERGENCY CONTACTS
              con.query(insertEmContacts, function(err, results){
                if(err){
                  con.release();
                  console.log('passport.js: Error while inserting emergency contacts.');
                  return done(err);
                }
                else{
                  //===============================================
                  //=== INSERT STUDENT INFO TO STUDENT DATABASE ===
                  //===============================================

                  // DO THIS ONLY IF THE STUDENT CHECKBOX IS SELECTED
                  if(newUser.student == 1){

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

                    // QUERYING THE DATABASE TO INSERT STUDENT'S INFO
                    con.query(studentInsert, function(err, results){
                      if(err){
                        con.release();
                        console.log("passport.js: Error while inserting student's info");
                        return done(err);
                      }

                      // FINISHED INSERTING A NEW USER
                      return done(null, newUser);
                    });
                  }
                  else{
                    // FINISHED INSERTING A NEW USER
                    return done(null, newUser);
                  }
                }
              });
            });
          }
        });
      });
    });
  }));

  //=============LOGIN strategy=======================//

  //===============================
  //======== TOKENED LOGIN ========
  //===============================
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, username, password, done){

    // SANITIZING USER INPUT FROM LOGIN PAGE
    for(var i in req.body){
      req.body[i] = sanitizer.sanitize(req.body[i]);
    }

    // SETTING UP QUERY TO LOOK FOR USERNAME IN DATABASE
    var sql = "SELECT * FROM ?? WHERE ?? = ?;";
    var inserts = ['gibson.user', 'username', req.body.username];
    sql = mysql.format(sql, inserts);

    //GET POOLING CONNECTION
    connection.getConnection(function(err, con){

    async.waterfall([
            function (next){
                // QUERYING DB
                con.query(sql, function(err, results){
                    // ERROR QUERYING THE DB
                    if (err){
                        console.log ('passport.js: Error while querying database for username; local-login');
                        return next (err, null);
                    }

                    if(!results.length){
                        console.log (req.body.username +' not found in user table.');
                        return next('No user found', null);
                    }

                    // USER EXISTS, BUT INVALID PASSWORD ENTERED
                    if (!bcrypt.compareSync(password, results[0].password)){
                        console.log ('Wrong password for ' +req.body.username);
                        return next ('bad password', null); //, req.flash('loginMessage', 'Incorrect Password.')
                    }
                    //console.log(results);
                    next(null, results);
                });
            },

            function (userresults, next){
                // UPDATING THE LAST LOGIN TIME IN THE DATABASE
                console.log("Username exists and password matches\n"+typeof(userresults));
                var user = userresults;
                var lastLogIn = user[0].last_login_time; // The value before the login time is replaced to CURRENT_TIMESTAMP
                var updateLastLogin = 'UPDATE gibson.user SET last_login_time = CURRENT_TIMESTAMP WHERE username = ?;';
                updateLastLogin = mysql.format (updateLastLogin, req.body.username);

                con.query (updateLastLogin, function (err, results){

                    if (err){
                        console.log ('passport.js: Error updating last_login_time.');
                        return next('Error updating last login time', null);
                    }
                    user[0].last_login_time = lastLogIn;
                    //console.log(user[0]);
                    return next (null, user[0]);
                });
            }
        ],
            function(err, results){
                //console.log(err + "\n" + JSON.stringify(results));
                if(err)
                {
                    console.log('here we go!');
                    con.query(mysql.format('SELECT * FROM gibson.temp_user WHERE username = ?;', [req.body.username]), function (err, results){
                        con.release();

                        if(err){
                            console.log('passport.js: Error while querying database for username; local-login');
                            return done(null, err, {message: 'passport.js: Error while querying database for username; local-login'});
                        }

                        if (!results.length){
                            console.log (req.body.username +' not found in the temp database.');
                            return done(null, false, {message:'not found in temp database'}); //, req.flash('loginMessage', 'Invalid Username.')
                        }
                        // USER IS FOUND IN temp_user -> NEEDS TO AUTHENTICATE EMAIL
                        else{
                            console.log(req.body.username +' needs to confirm their email.');
                            return done(null, false, {message:'email not confirmed'});
                        }
                    });
                }

                else{
                    console.log(results);
                    con.release();
                    return done(null, results);
                }
            });
    });
  }));

  return passport;
};
