var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var config = require('../server_config.js');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');

//SETUP POOLING CONNECTION
var connection = mysql.createPool(config.db_config);

//CHECK POOLING CONNECTION
connection.getConnection(function(err, con){
    if(err){
        console.log('Error connecting to Db');
    }
    else{
        console.log('Connection established');
    }

    return;
});

module.exports = function(passport){

 // SINCE WE USING TOKENS, PASSPORT NO LONGER CALLS THE SERIALIZE FUNCTIONS.
 // *MOVED OUTSIDE OF passport.js*
 // used to serialize the user for the session
 /*
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });
*/

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        var sql = "SELECT * FROM gibson.user WHERE username = ?";
        var inserts = [id];
        sql = mysql.format(sql, inserts);
        console.log(sql);

        //query to look for the user with serialized username
        connection.getConnection(function(err, con)
        {
            con.query(sql,function(err, results)
            {
                con.release();
                done(err, results[0]);
            });
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({

        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done){


        // Sanitize input
        for(var i in req.body){
            req.body[i] = sanitizer.sanitize(req.body[i]);
        }

        var sql = "SELECT * FROM ?? WHERE ?? = ?;";
        var inserts = ['gibson.user', 'username', req.body.username];
        sql = mysql.format(sql, inserts);

        //GET POOLING CONNECTION
        connection.getConnection(function(err, con){

            con.query(sql, function(err, results){

             if(err){//check for error
                 con.release();
                 console.log('error');
                 return done(err);
              }

              if(results.length){ //user exist in this case
                 con.release();
                 console.log('User already exist with that username or email');
                 return done(null, false, req.flash('signupMessage', 'User already exist with that email'));

              }
              else{ // user DNE, -> make new user.
                  var newUser = {username:null, password:null, lname:null, fname:null, birth_date:null, gender:null, address:null, unit_no:null, city:null,
                                province_id:null, postal_code:null, primary_phone:null, secondary_phone:null, email:null, send_notification:null, student:null};

                  //initialize newUser values
                  newUser.username = req.body.username;
                  newUser.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(Math.floor(3*Math.random())+10));
                  newUser.lname = req.body.lname;
                  newUser.fname = req.body.fname;
                  newUser.birth_date = req.body.birth_date;
                  newUser.gender = req.body.gender;
                  newUser.address = req.body.address;
                  newUser.unit_no = req.body.apt;
                  newUser.city = req.body.city;
                  newUser.province_id = req.body.province_id;
                  newUser.postal_code = req.body.postal_code.replace(/ /g,''); //Deletes the white space in postal code.
                  newUser.primary_phone = req.body.primary_phone;
                  newUser.secondary_phone = req.body.secondary_phone;
                  newUser.email = req.body.email;
                  newUser.send_notification = 1;
                  newUser.student = 1;

                  // creating query
                  var createUser  = 'INSERT INTO gibson.user (username, password, lname, fname, birth_date, gender, address, unit_no, city, ';
                      createUser +=                          'province, postal_code, primary_phone, secondary_phone, email, send_notification, ';
                      createUser +=                          'student) ';
                      createUser += 'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                  var values = [newUser.username, newUser.password, newUser.lname, newUser.fname, newUser.birth_date, newUser.gender,
                                newUser.address, newUser.unit_no, newUser.city, newUser.province_id, newUser.postal_code, newUser.primary_phone,
                                newUser.secondary_phone, newUser.email, newUser.send_notification, newUser.student];

                  createUser = mysql.format(createUser, values);

                  // querying the database
                  con.query(createUser, function(err, results){
                      con.release();
                        if(err){
                          console.log('INSERT ERROR');
                        }
                        console.log(createUser);
                        return done(null, newUser);
                  });
                }
            });
        });
    }));



//=============LOGIN strategy=======================//

//=========================================================
// TOKENED LOGIN ==========================================
//=========================================================
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //pass back the entire request from our form
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
          console.log ('Error while quering the database. (local-login)');
          return done (err);
        }
        // USER DOES NOT EXIST
        if(!results.length){
          console.log (req.body.username +' not found in the database.');
          return done (null, false, req.flash('loginMessage', 'Invalid Username.'));
        }
        // USER EXISTS, BUT INVALID PASSWORD ENTERED
        if (!bcrypt.compareSync(password, results[0].password)){
          console.log ('Wrong password for ' +req.body.username);
          return done (null, false, req.flash('loginMessage', 'Incorrect Password.'));
        }

        // USER EXISTS AND CORRECT PASSWORD ENTERED

        //UPDATING THE LAST LOGIN TIME IN THE DATABASE
        var lastLogIn = results[0].last_login_time; // The value before the login time is replaced to CURRENT_TIMESTAMP
        var updateLastLogin = 'UPDATE gibson.user SET last_login_time = CURRENT_TIMESTAMP WHERE username = ?;';
        updateLastLogin = mysql.format (updateLastLogin, req.body.username);

        con.query (updateLastLogin, function (err, updateResults){
          con.release();  // RELEASING CONNECTION

          if (err){
            console.log ('Error updating last_login_time');
          }

          results[0].last_login_time = lastLogIn;
          return done (null, results[0]);

        });
      });
    });
  }));

  return passport;
};
