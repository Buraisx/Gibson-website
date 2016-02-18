var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');

//MAKE SURE TO CHANGE THIS TO CONNECT TO THE RIGHT DATABASE
var connection = mysql.createConnection({

	host: '192.168.2.22',
	user: 'root',
	password : 'makiforlife'
});

//connection.query();

connection.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
    }

    else
        console.log('Connection established');
    return;
});

module.exports = function(passport){

 // used to serialize the user for the session
    passport.serializeUser(function(user, done) {

        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        var sql = "SELECT * FROM gibson.user WHERE username = ?";
        var inserts = [id];
        sql = mysql.format(sql, inserts);
        console.log(sql);

        //query to look for the user with serialized username
        connection.query(sql,function(err, results){
            done(err, results[0]);
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
        var sql = "SELECT * FROM ?? WHERE ?? = ?;";
        var inserts = ['gibson.user', 'username', req.body.username];
        sql = mysql.format(sql, inserts);

				// Sanitize input
        for(var i in req.body){
            req.body[i] = sanitizer.sanitize(req.body[i]);
        }

        connection.query(sql, function(err, results){

            if(err){
                //check for error
                console.log('error');
                return done(err);
            }

            if(results.length > 0){
                //user exist in this case
                console.log('User already exist with that username or email');
                return done(null, false, req.flash('signupMessage', 'User already exist with that email'));

            }
            else{

                var newUser = {username:null, password:null, lname:null, fname:null, birth_date:null, gender:null, address:null, unit_no:null,
                               city:null, province:null, postal_code:null, primary_phone:null, secondary_phone:null, email:null, send_notification:null, student:null};

                //initialize newUser values
                newUser.username = req.body.username;
                newUser.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync((Math.floor(Math.random()* 32) + 1)), null);
                newUser.lname = req.body.lname;
                newUser.fname = req.body.fname;
                newUser.birth_date = req.body.birth_date;
                newUser.gender = req.body.gender;
                newUser.address = req.body.address;
                newUser.unit_no = req.body.apt;
                newUser.city = req.body.city;
                newUser.province = req.body.province;
                newUser.postal_code = req.body.postal_code;
                newUser.primary_phone = req.body.primary_phone;
                newUser.secondary_phone = req.body.secondary_phone;
                newUser.email = req.body.email;
                newUser.send_notification = 1;
                newUser.student = 1;

                // creating query
                var createUser =  'INSERT INTO gibson.user (username, password, lname, fname, birth_date, gender, address, unit_no, city, province, postal_code, primary_phone, secondary_phone, email, send_notification, student) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                var values = [newUser.username, newUser.password, newUser.lname, newUser.fname,
                              newUser.birth_date, newUser.gender, newUser.address, newUser.unit_no, newUser.city, newUser.province, newUser.postal_code,
                              newUser.primary_phone, newUser.secondary_phone, newUser.email, newUser.send_notification, newUser.student];

                createUser = mysql.format(createUser, values);

                // querying the database
                connection.query(createUser, function(err, results){
                    if(err)
                    {
                        console.log('INSERT ERROR');
                    }
                    console.log(createUser);
                    return done(null, newUser);
                });
            }
        });
    }));

//=============LOGIN strategy=======================//

    passport.use('local-login', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //pass back the entire request from our form

        }, function(req, username, password, done){

            var sql = "SELECT * FROM ?? WHERE ?? = ?;";
            var inserts = ['gibson.user', 'username', req.body.username];
            sql = mysql.format(sql, inserts);

			// Sanitizing input
            for(var i in req.body){
            req.body[i] = sanitizer.sanitize(req.body[i]);
            }

            connection.query(sql, function(err, results){
                console.log(results);
                if(err){//login error
                    console.log("Login Error");
                    return done(err);
                }
                if(!results.length > 0){//user does not exist
                    console.log('The user does not exist');
                    return done(null, false, req.flash('loginMessage', 'User does not exist!'));
                }
                if(!bcrypt.compareSync(password, results[0].password)){//incorrect password
                    console.log("Wrong password");
                    return done(null, false, req.flash('loginMessage', 'Incorrect Password.'));
                }

                //user exist and return and authenticates user
                return done(null, results[0]);

            });
        }
    ));
        return passport;

};
