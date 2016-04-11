var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var async = require('async');
var mysql = require('mysql');
var router = express.Router();
var connection = require('../mysqlpool');

router.get('/confirm', function(req, res){

  connection.getConnection(function(err, con){
    if(err){
      console.log('confirm.js: Token verification failed.');
      res.redirect('/error');
    }
    else{
      async.waterfall([

        // CHECKING INTEGRITY OF THE TOKEN
        function(next){
          jwt.verify(req.query.token, config.jwt.oneUseSecret, function(err, decoded){
            if(err){
              console.log('confirm.js: Token verification failed.');
              return next({no: 400, msg:'Bad Token'}, null);
            }
            else{
              next(null, decoded);
            }
          });
        },

        // CHECKING IF THE TOKEN IS BLACKLISTED OR NOT
        function(decoded, next){
          con.query('SELECT blacklisted FROM gibson.active_tokens WHERE token_id = ?', [decoded.token_id], function(err, results){
            if(err){
              console.log('confirm.js: Error while checking if token is blacklisted');
              return next({no:500, msg:'Error while checking token.'});
            }
            else if(results[0].blacklisted == 1){
              console.log('confirm.js: Error, token is already blacklisted');
              return next({no:400, msg:'Bad Token'});
            }
            else{
              next(null, decoded);
            }
          });
        },

        // QUERYING FOR TEMP USER'S user_id
        function(decoded, next){
          con.query('SELECT user_id, student FROM gibson.temp_user WHERE username = ?', [decoded.user], function(err, results){
            if(err){
              console.log('confirm.js: Error while querying temporary user_id');
              return next({no:500, msg:'Error while querying for temp user id.'}, null);
            }
            else if(results.length === 0){
              console.log('confirm.js: No temp user found in database');
              return next({no:500, msg:'No user with that username.'}, null);
            }
            else{
              next(null, decoded.user, results[0].user_id, results[0].student);
            }
          });
        },

        // STARTS TRANSACTION WITH THE DATABASE
        function(username, tempUserId, student, next){
          con.query('START TRANSACTION;', function(err, results){
            if(err){
              console.log('confirm.js: Error starting transaction with the database.');
              return next({no:500, msg:'Transaction error with the database.'}, null);
            }
            else{
              next(null, username, tempUserId, student);
            }
          });
        },

        // COPYING USER FROM TEMP TABLE TO PERMANENT TABLE
        function(username, tempUserId, student, next){
          var query =  'INSERT INTO gibson.user (rank_id, username, password, lname, fname, birth_date, gender, address, unit_no, city, province_id, postal_code, primary_phone, secondary_phone, email, send_notification, student, creation_date) ';
              query += 'SELECT rank_id, username, password, lname, fname, birth_date, gender, address, unit_no, city, province_id, postal_code, primary_phone, secondary_phone, email, send_notification, student, creation_date FROM gibson.temp_user WHERE user_id = ?;';

          query = mysql.format(query, [tempUserId]);

          con.query(query, function(err, results){
            if(err){
              console.log('confirm.js: Error migrating user from temporary table to permanent table.');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null, username, tempUserId, results.insertId, student);
            }
          });
        },

        // QUERYING FOR EMERGENCY CONTACT INFORMATION
        function(username, tempUserId, permUserId, student, next){
          con.query('SELECT lname, fname, relationship, contact_phone, creation_date FROM gibson.temp_emergency_contact WHERE user_id = ?', [tempUserId], function(err, results){
            if (err){
              console.log('confirm.js: Error querying for emergency contacts of temporary user.');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null, username, tempUserId, permUserId, student, results);
            }
          });
        },

        // COPYING EMERGENCY CONTACT INFORMATION FROM TEMPORARY TABLE TO PERMANENT TABLE
        function(username, tempUserId, permUserId, student, emContacts, next){

          var inserts = [];
          var query = '';

          // CREATING QUERY FOR INSERTING EMERGENCY CONTACT
          for (var i = 0; i < emContacts.length; i++){
            inserts = [permUserId, emContacts[i].lname, emContacts[i].fname, emContacts[i].relationship, emContacts[i].contact_phone, emContacts[i].creation_date];
            query += mysql.format('INSERT INTO gibson.emergency_contact (user_id ,lname, fname, relationship, contact_phone, creation_date) VALUES(?, ?, ?, ?, ?, ?); ', inserts);
          }

          con.query(query, function(err, results){
            if(err){
              console.log('confirm.js: Error copying emergency contacts.');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null, username, tempUserId, permUserId, student);
            }
          });
        },

        // COPY STUDENT INFORMATION IF USER IS A STUDENT
        function(username, tempUserId, permUserId, student, next){
          if (student == 1){

            var query = 'INSERT INTO gibson.student (user_id ,school_name, grade, major, esl_level) SELECT ?, school_name, grade, major, esl_level FROM gibson.temp_student WHERE user_id = ?;';
            query = mysql.format(query, [permUserId, tempUserId]);

            con.query(query, function(err, results){
              if(err){
                console.log('confirm.js: Error copying student information.');
                return next({no:500, msg:'Error migrating user'}, null);
              }
              else{
                next(null, username, tempUserId);
              }
            });
          }
          // NOT A STUDENT
          else{
            next(null, username, tempUserId);
          }
        },

        // FINDING ALL SIGNUP TOKENS FOR THE USER
        function(username, tempUserId, next){

          var query = 'SELECT token_id FROM gibson.active_tokens WHERE username = ? AND `desc` = ?;';
          query = mysql.format(query, [username, config.jwt.type.signup]);

          con.query(query, function(err, results){
            if(err){
              console.log('confirm.js: Error looking up list of token_id');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null, tempUserId, results);
            }
          });
        },

        // BLACKLISTING ALL OF THE TOKENS FOUND
        function(tempUserId, tokenList, next){

          // STRINGIFYING tokenList ARRAY
          var tokenListString = '(';
          for (var i in tokenList) tokenListString += tokenList[i].token_id +', ';
          tokenListString = tokenListString.slice(0, -2) +')';

          var query = 'UPDATE gibson.active_tokens SET blacklisted = 1 WHERE token_id IN {token_id_list};';
          query = query.replace('{token_id_list}', tokenListString);

          con.query(query, function(err, results){
            if(err){
              console.log('confirm.js: Unable to blacklist token');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null, tempUserId);
            }
          });
        },

        // REMOVING USER FROM THE TEMPORARY USER TABLE
        function(tempUserId, next){

          var query = 'DELETE FROM gibson.temp_user WHERE user_id = ?';
          query = mysql.format(query, [tempUserId]);

          con.query(query, function(err, results){
            if(err){
              console.log('confirm.js: Unable to remove user from temporary table.');
              return next({no:500, msg:'Error migrating user'}, null);
            }
            else{
              next(null);
            }
          });
        }
      ],

      // THE FUNCTION THAT CATCHES THE ERROR
      function(err){
        if(err){
          con.query('ROLLBACK;', function(err, results){
            con.release();
            res.redirect('/error');
          });
        }
        else{
          con.query('COMMIT;', function(err, results){
            con.release();
            res.redirect('/signupconfirm');
          });
        }
      });
    }
  });
});


router.get('/signupconfirm', function(req, res){
  res.render('signupconfirm', {title: 'E-mail Address Confirmed'});
});

module.exports = router;
