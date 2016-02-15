var LocalStrategy = require('passport-local').Strategy;
var mysql = require('node-mysql');

var connection = mysql.createConnection({
			
	host: '192.168.1.33',
	user: 'root',
	password : 'Sabad@th!s1234567'
});

//connection.query('USE gibson');

module.exports = function(passport){

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
 
    	var sql = "SELECT * FROM ?? WHERE ?? = ?";
    	var inserts = ['user', 'username', id];
    	sql = mysql.format(sql, inserts);
    	console.log(sql);

	    //query to look for the user with serialized username
		connection.query(sql,function(err, results){	
			done(err, results[0]);
		});
    });

    passport.use('local-signup', new LocalStrategy({
    
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done){

    	var sql = "SELECT * FROM ?? WHERE ?? = ?";
    	var inserts = ['user', 'username', req.body.username];
    	sql = mysql.format(sql, inserts);

    	connection.query(sql, function(err, results){

    		if(err){
    			//check for error
    			return done(err);
    		}

    		if(results.length){
    			//user exist in this case
    			return done(null, false, req.flash('signupMessage', 'User already exist with that email'));

    		}
    		else{

    			var newUser = {username:null, password:null, lname:null, fname:null, birthdate:null, gender:null, address:null, unit_no:null,
    						   city:null, province:null, postal_code:null, primary_phone:null, secondary_phone:null, email:null, send_notification:null};

    			//initialize newUser values
    			newUser.username = req.body.username;
    			newUser.password = req.body.password;
    			newUser.lname = req.body.lname;
    			newUser.fname = req.body.fname;
    			newUser.birthdate = req.body.birth_date;
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

    			// creating query 
    			var createUser =  'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    			var values = ['user', 'username', 'password', 'lname', 'fname', 'birthdate', 'gender', 'address', 'unit_no', 'city', 'province', 'postal_code'
    						  'primary_phone', 'secondary_phone', 'email', 'send_notification', newUser.username, newUser.password, newUser.lname, newUser.fname,
    						  newUser.birthdate, newUser.gender, newUser.address, newUser.unit_no, newUser.city, newUser.province, newUser.postal_code,
    						  newUser.primary_phone, newUser.secondary_phone, newUser.email, newUser.send_notification];

    			createUser = mysql.format(createUser, values);

    			// querying the database
    			connection.query(createUser, function(err, results){
    				return done(null, newUser);
    			});
    		}
    	});
    
    	}
	
	}));

    return passport;
};