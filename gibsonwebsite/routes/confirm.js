var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var router = express.Router();

router.get('/confirm', function(req, res) {

  jwt.verify(req.query.token, config.jwt.oneUseSecret, function(err, decoded){

    // TOKEN VERIFICATION FAILED
    if (err){
      console.log('confirm.js: Token verification failed.');
      res.redirect('/error');
    }

    // CREATES POOLING connection
    config.db_config.multipleStatements = true;
    var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
      if(err){
        con.release();
        console.log('confirm.js: Error connecting to the database.');
        res.redirect('/error');
      }
      else{

        // CHECK IF TOKEN IS ALREADY BLACKLISTED
        con.query('SELECT blacklisted FROM gibson.active_tokens WHERE token_id = ?', [decoded.token_id], function(err, results){
          if (err){
            con.release();
            console.log('confirm.js: Error while checking if token is blacklisted');
            res.redirect('/error');
          }

          // TOKEN IS ALREADY BLACKLISTED
          if (results[0].blacklisted == 1){
            con.release();
            console.log('confirm.js: Error, token is already blacklisted');
            res.redirect('/error');
          }
          else{

            // QUERYING FOR USER IN THE TEMPORARY TABLE.
            con.query('SELECT * FROM gibson.temp_user WHERE username = ?', [decoded.user], function(err, results){
              if (err){
                con.release();
                console.log('confirm.js: Error while querying temp_user');
                res.redirect('/error');
              }

              // NO USER FOUND IN TEMPORARY TABLE
              if (results.length == 0){
                con.release();
                console.log('confirm.js: Requested user does not exist');
                res.redirect('/error');
              }
              else{

                // USER INFO USER
                var tempUser = results[0];
                var newUserId;

                // QUERY TO MOVE USER INFO FROM gibson.temp_user TO gibson.user
                var query =  'INSERT INTO gibson.user (rank_id, username, password, lname, fname, birth_date, gender, address, unit_no, city, province_id, postal_code, primary_phone, secondary_phone, email, send_notification, student, creation_date) ';
                    query += 'SELECT rank_id, username, password, lname, fname, birth_date, gender, address, unit_no, city, province_id, postal_code, primary_phone, secondary_phone, email, send_notification, student, creation_date FROM gibson.temp_user WHERE user_id = ' +tempUser.user_id +';';

                con.query(query, function(err, results){
                  if (err){
                    con.release();
                    console.log('confirm.js: Error migrating user from temporary table to permanent table.');
                    res.redirect('/error');
                  }
                  else{
                    // SETTING NEW USER ID FROM THE PERMANENT gibson.user
                    newUserId = results.insertId;

                    // QUERYING FOR ALL EMERGENCY CONTACTS OF THE TEMPORARY USER
                    con.query('SELECT * FROM gibson.temp_emergency_contact WHERE user_id = ?', [tempUser.user_id], function(err, results){
                      if (err){
                        con.release();
                        console.log('confirm.js: Error querying for emergency contacts of temporary user.');
                        res.redirect('/error');
                      }
                      else{
                        // RESETTING QUERY
                        query = '';
                        var emContactValues = [];

                        // CREATING QUERY FOR INSERTING EMERGENCY CONTACT
                        for (var i = 0; i < results.length; i++){
                          emContactValues = [newUserId, results[i].lname, results[i].fname, results[i].relationship, results[i].contact_phone, results[i].creation_date];
                          query += mysql.format('INSERT INTO gibson.emergency_contact (user_id ,lname, fname, relationship, contact_phone, creation_date) VALUES(?, ?, ?, ?, ?, ?); ', emContactValues);
                        }

                        // ADD STUDENT QUERY IF TEMP USER IS A STUDENT
                        if (tempUser.student == 1){
                          query += mysql.format('INSERT INTO gibson.student (user_id ,school_name, grade, major, esl_level) SELECT ?, school_name, grade, major, esl_level FROM gibson.temp_student WHERE user_id = ?;', [newUserId, tempUser.user_id]);
                        }

                        // INSERTING EMERGENCY CONTACTS AND STUDENT INFO
                        con.query(query, function(err, results){
                          if (err){
                            con.release();
                            console.log('confirm.js: Error while inserting emergency contacts and student information.');
                            res.redirect('/error');
                          }
                          else{
                            // USER DATA IS NOW TRANSFERED FROM TEMPORARY TABLES TO PERMANENT TABLES
                            // BLACKLISTING ALL ACTIVE SIGNUP CONFIRMATION TOKENS ASSOCIATED WITH THE USER

                            // FINDING TOKENS ID TIED TO THE TEMPORARY USER
                            con.query('SELECT token_id FROM gibson.active_tokens WHERE username = ? AND `desc` = ?;', [tempUser.username, config.jwt.type.signup], function(err, results){
                              if (err){
                                con.release();
                                console.log("confirm.js: Error querying the database for token id's");
                                res.redirect('/error');
                              }
                              else{
                                // CONSTRUCTING QUERY FOR BLACKLISTING TOKENS
                                var blacklistQuery = '';
                                for (var j = 0; j < results.length; j++){
                                    blacklistQuery += mysql.format('UPDATE gibson.active_tokens SET blacklisted = 1 WHERE token_id = ?;', [results[j].token_id]);
                                }

                                con.query(blacklistQuery, function(err, results){
                                  if (err){
                                    con.release();
                                    console.log('confirm.js: Error blacklisting active signup confirmation tokens');
                                    res.redirect('/error');
                                  }
                                  else{
                                    // USER IS NOW PERMANENT!
                                    res.redirect('/signupconfirm');
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
});

// FUNCTION TO BLACKLIST TOKENS
function blacklistTokens(user, decoded, next){

}

router.get('/signupconfirm', function(req, res){
  res.render('signupconfirm', {title: 'E-mail Address Confirmed'});
});

module.exports = router;
