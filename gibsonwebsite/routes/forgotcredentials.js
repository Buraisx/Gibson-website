var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var email = require('../authentication/auto_email');
var connection = require('../mysqlpool');
var token = require('../authentication/token');

router.get('/forgotusername', function(req,res,next){
	res.render('forgotusername', {title:'Forgot Username?'});
});


router.post('/forgotusername', function(req,res){
	connection.getConnection(function(err,con){
		if (err){
      console.log('forgotcredentials.js: Error connecting to the DB.');
      res.status(500).send();
    }

    // LOOK FOR THE USERNAME CORRESPONDING TO THE EMAIL
    var userquery = 'SELECT username FROM gibson.user WHERE email = ?;';
    var inserts = req.body.email;
    userquery = mysql.format(userquery, inserts);
    
    con.query(userquery, function(err, results){
     con.release();

      if(err){
      	res.status(500).send();
      }
      else if (!results.length){
        res.status(404).send("Username does not exist.");
      	//return (new Error("forgotcredentials.js: No user with this email found."));
      }
      else{

			   email.usernameReminder(req.body.email, results[0].username);
        //send user the email with the username
        res.status(200).send("Sent email with username successfully.");
      }
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
      res.status(500).send();
    }
    else{
      // LOOK FOR THE EMAIl CORRESPONDING TO THE USER
      var userquery = 'SELECT email FROM gibson.user WHERE username = ?;';
      var inserts = req.body.username;
      userquery = mysql.format(userquery, inserts);

      con.query(userquery, function(err, results){
      	con.release();

      	if(err){
      		res.status(500).send();
      	}
      	else if (!results.length){

          res.status(404).send("No email with this username found.");
      	}
        else{
          //send user the email with the password
          token.forgotPasswordToken(results[0].email, req.body.username);
          res.status(200).send("Successfully send the email with the changepassword link."); 
        }
      });
    }
	});
});


module.exports = router;
