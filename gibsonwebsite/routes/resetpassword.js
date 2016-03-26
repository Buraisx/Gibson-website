var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');
var router = express.Router();
var connection = require('../mysqlpool');

router.get('/resetpassword', function(req, res){
  res.render('resetpassword', {title:'Reset Password', token:req.query.token});
});

router.post('/resetpassword', function(req, res){

  // SANITIZES EVERYTHING COMING IN FROM REQ
  for(var i in req.body){
    req.body[i] = sanitizer.sanitize(req.body[i]);
  }

  if (req.body.password == req.body.passwordhashed){
    // VERIFYING TOKEN
    jwt.verify(req.body.token, config.jwt.oneUseSecret, function(err, decoded){

      // err -> TOKEN VERIFICATION FAILED
      if (err){
        console.log('resetpassword.js: Token verification failed.');
        res.redirect('/error');
      }
      // NO err -> CONTINUE
      else{

        // GETTING A CONNECTION TO THE DATABASE.
        connection.getConnection(function(err, con){
          if(err){
            con.release();
            console.log('resetpassword.js: Error connecting to the database.');
            res.redirect('/error');
          }
          else{

            // CHECKING IF THE TOKEN IS ALREADY BLACKLISTED
            con.query('SELECT blacklisted FROM gibson.active_tokens WHERE token_id = ?;', [decoded.token_id], function(err, results){
              if (err){
                con.release();
                console.log('resetpassword.js: Error querying the database for blacklisted.');
                res.redirect('/error');
              }
              else{

                // TOKEN IS ALREACY BLACKLISTED
                if (results[0].blacklisted == 1){
                  con.release();
                  console.log('resetpassword.js: One-use token is already blacklisted.');
                  res.redirect('/error');
                }
                // TOKEN IS NOT BLACKLISTED
                else{

                  // STARTS MAKING CHANGES TO THE DATABASE
                  con.query('START TRANSACTION;', function(err, results){
                    if(err){
                      con.release();
                      console.log('resetpassword.js: Error starting transaction with the database.');
                      res.redirect('/error');
                    }
                    else{

                      // BLACKLISTING THE TOKEN THAT IS ABOUT TO BE USED.
                      con.query('UPDATE gibson.active_tokens SET blacklisted = 1 WHERE token_id = ?;', [decoded.token_id], function(err, results){

                        // ROLLBACK CHANGES IF UNABLE TO BLACKLIST TOKEN.
                        if(err){
                          con.query('ROLLBACK;', function(err, results){
                            con.release();
                            console.log('resetpassword.js: Error updating blackisted for token.');
                            res.redirect('/error');
                          });
                        }
                        // TOKEN BLACKLISTED SUCCESSFULLY
                        else{
                          var newPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(Math.floor(3*Math.random())+10));

                          // UPDATING DATABASE WITH NEW PASSWORD
                          con.query('UPDATE gibson.user SET password = ? WHERE username = ?;', [newPassword, decoded.user], function(err, results){

                            // ROLLBACK CHANGES IF UNABLE TO UPDATE PASSWORD
                            if(err){
                              con.query('ROLLBACK;', function(err, results){
                                con.release();
                                console.log('resetpassword.js: Error updating password.');
                                res.redirect('/error');
                              });
                            }
                            // PASSWORD UPDATED SUCCESSFULLY
                            else{
                              con.query('COMMIT;', function(err, results){
                                con.release();
                                res.redirect('/');
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }
  else{
    res.redirect('/error');
  }
});

module.exports = router;
