var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var config = require('../server_config.js');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');

// SETUP POOLING CONNECTION
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

        //=======================================
        //=== USER NOT FOUND -> MAKE NEW USER ===
        //=======================================
        else{
          var newUser = {
            username:null, password:null, lname:null, fname:null, birth_date:null,
            gender:null, address:null, unit_no:null, city:null, province_id:null,
            postal_code:null, primary_phone:null, secondary_phone:null, email:null,
            send_notification:null, student:null
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
          var createUser  = 'INSERT INTO gibson.user (username, password, lname, fname, birth_date, gender, address, unit_no, city, ';
              createUser +=                          'province_id, postal_code, primary_phone, secondary_phone, email, send_notification, ';
              createUser +=                          'student) ';
              createUser += 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
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
              return done(err);
            }

            // QUERYING FOR NEW USER'S user_id
            var query_id = mysql.format('SELECT user_id FROM gibson.user WHERE username = ?;', newUser.username);
            var userId;

            con.query(query_id, function(err, results){
              if(err){
                con.release();
                console.log("passport.js: Error while quering for new user's user_id");
                return done(err);
              }

              userId = results[0].user_id;

              //==========================================================================
              //=== INSERT NEW USER'S EMERGENCY CONTACTS TO EMERGENCY_CONTACT DATABASE ===
              //==========================================================================

              var emContacts = [];
              var i = 1;
              var contact = {
                user_id:userId, fname:null, lname:null, relationship:null, contact_phone:null
              };

              // PUSHING EMERGENCY CONTACT JSON OBJECT INTO emContacts ARRAY.
              while(true){

                // STOPS WHEN ALL JSON OBJECTS HAD BEEN PUSHED INTO emContacts ARRAY
                if(!req.body['ephone' + i])
                  break;

                  contact.fname = req.body['emergencyfname' + i];
                  contact.lname = req.body['emergencylname' + i];
                  contact.relationship = req.body['relationship' + i];
                  contact.contact_phone = req.body['ephone' + i];

                  emContacts.push(contact);
                  i += 1;
                }

                var createEContacts =  'INSERT INTO gibson.emergency_contact (user_id, lname, fname, relationship, contact_phone)';
                  createEContacts += 'VALUES (?,?,?,?,?);';

                // INSERTING ALL EMERGENCY CONTACTS INTO DATABASE
                for(var emc = 0; emc < emContacts.length; emc++){

                  var econtact_values = [
                    emContacts[emc].user_id, emContacts[emc].fname, emContacts[emc].lname,
                    emContacts[emc].relationship, emContacts[emc].contact_phone
                  ];

                  var contactInsert = mysql.format(createEContacts, econtact_values);

                  // QUERYING THE DATABASE TO INSERT EMERGENCY CONTACTS
                  con.query(contactInsert, function(err, results){
                    if(err){
                      con.release();
                      console.log('passport.js: Error while inserting emergency contacts.');
                      return done(err);
                    }
                  });
                }

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

                  var createStudent = 'INSERT INTO gibson.student (user_id, school_name, grade, major, esl_level)';
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
            });
          });
        }
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

      // QUERYING DB
      con.query(sql, function(err, results){

        // ERROR QUERYING THE DB
        if (err){
          console.log ('passport.js: Error while querying database for username; local-login');
          return done (err);
        }
        // USER DOES NOT EXIST
        if(!results.length){
          console.log (req.body.username +' not found in the database.');
          return done (null, false); //, req.flash('loginMessage', 'Invalid Username.')
        }
        // USER EXISTS, BUT INVALID PASSWORD ENTERED
        if (!bcrypt.compareSync(password, results[0].password)){
          console.log ('Wrong password for ' +req.body.username);
          return done (null, false); //, req.flash('loginMessage', 'Incorrect Password.')
        }

        // USER EXISTS AND CORRECT PASSWORD ENTERED

        // UPDATING THE LAST LOGIN TIME IN THE DATABASE
        var lastLogIn = results[0].last_login_time; // The value before the login time is replaced to CURRENT_TIMESTAMP
        var updateLastLogin = 'UPDATE gibson.user SET last_login_time = CURRENT_TIMESTAMP WHERE username = ?;';
        updateLastLogin = mysql.format (updateLastLogin, req.body.username);

        con.query (updateLastLogin, function (err, updateResults){
          con.release();  // RELEASING CONNECTION

          if (err){
            console.log ('passport.js: Error updating last_login_time.');
          }

          results[0].last_login_time = lastLogIn;
          return done (null, results[0]);
        });
      });
    });
  }));

  return passport;
};
