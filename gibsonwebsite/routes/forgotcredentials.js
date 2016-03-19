var express = require('express');
var router = express.Router();
var connection = require('../mysqlpool');

router.get('/forgotusername', function(req,res,next){

	res.render('forgotusername', {title:'Forgot Username?'});

});

router.post('/forgotusername', function(req,res,next){

	connection.getConnection(function(err,con){

		if (err){
        	console.log('forgotcredentials.js: Error connecting to the DB.');
        	//res.end();
        	return err;
      	}

      	// LOOK FOR THE USERNAME CORRESPONDING TO THE EMAIL
      	var userquery = 'SELECT username FROM gibson.user WHERE email = ?;';
      	var inserts = req.body.email;
      	userquery = mysql.format(userquery, inserts);

      	con.query(userquery, function(err, results){

      		con.release();

      		if(err){

      			return (new Error("forgotcredentials.js: Query error for forgot username"))
      		}
      		else if (!results.length){

      			return (new Error("forgotcredentials.js: No user with this email found."));
      		}

      		//send user the email with the username
      		res.send("LOLZ SEND THE EMAILS LOL");

      	});

	});

});

router.get('/forgotpassword', function(req,res,next){

	res.render('forgotpassword', {title:'Forgot Password?'});

});

router.post('/forgotpassword', function(req,res,next){

	connection.getConnection(function(err,con){

		if (err){
        	console.log('forgotcredentials.js: Error connecting to the DB.');
        	//res.end();
        	return err;
      	}

      	// LOOK FOR THE EMAIl CORRESPONDING TO THE USER
      	var userquery = 'SELECT email FROM gibson.user WHERE username = ?;';
      	var inserts = req.body.username;
      	userquery = mysql.format(userquery, inserts);

      	con.query(userquery, function(err, results){

      		con.release();

      		if(err){

      			return (new Error("forgotcredentials.js: Query error for forgot password"))
      		}
      		else if (!results.length){

      			return (new Error("forgotcredentials.js: No email with this username found."));
      		}

      		//send user the email with the username
      		res.send("LOLZ SEND THE EMAILS LOL");

      	});

	});



});


module.exports = router;