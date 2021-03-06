var config = require('../server_config');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var connection = require('../mysqlpool');
var autoemail = require('./auto_email');
var async = require('async');

// CHANGE COMMENT WHEN CHANGING THE AGE
// COOKIE AGE: 1 DAY (24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second)
var cookie_age = 24*60*60*1000;

// JWT TOKEN AGE: 1 DAY (24 hours/day * 60 minutes/hour * 60 seconds/minute)
var jwt_age = 24*60*60

// ONE-TIME TOKEN
function generateOneUse(req, res, next){

  // SETTING UP CONNECTION TO THE DATABASE
  connection.getConnection(function(err, con){
    if (err){
      console.log('token.js: Error connecting to the database.');
      return err;
    }

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // user_id HERE REFERS TO THE TEMPORARY TABLE, NOT gibson.user
    var query =  'INSERT INTO gibson.active_tokens (username, expiry_date, \`desc\`)';
        query += 'VALUES (?, ?, ?);';
    var inserts = [req.user.username, tomorrow.toISOString().slice(0, 19).replace('T', ' '), config.jwt.type.signup];
    query = mysql.format(query, inserts);

    // INSERTING A NEW TOKEN INTO
    con.query(query, function(err, results){
      con.release();

      if (err){
        console.log('token.js: Error inserting one use token');
        res.redirect ('/error');
        return;
      }

      // MAKE TOKEN AND STORE IN req.oneUseToken
      req.oneUseToken = jwt.sign({
        token_id: results.insertId,
        iss: config.jwt.issuer,
        user: req.user.username,
        type: config.jwt.type.signup
      },
      config.jwt.oneUseSecret, {
        expiresIn: jwt_age
      });

      next();
    });
  });
}


// FUNCTION FOR CREATING NEW TOKEN FOR RESENDING CONFIRMATION EMAIL
function resendToken(username, callback){

  connection.getConnection(function(err, con){
    if(err){
      console.log('token.js: Error connecting to the database.');
      callback({no:500, msg:'Connection to database failed.'}, null);
    }
    else{
      // CHECKING IF USER IS IN TEMPORARY TABLE
      con.query('SELECT email FROM gibson.temp_user WHERE username = ?;', [username], function(err, results){
        if(err){
          console.log('token.js: Unable to query for email; resendToken');
          callback({no:500, msg:'Unable to find email address.'}, null);
        }
        else if(results.length === 0){
          console.log('token.js: No user found in temp table.');
          callback({no:500, msg:'Unable to find email address.'}, null);
        }
        // USER IS IN TEMP TABLE:
        else{

          var email = results[0].email;
          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          var query =  'INSERT INTO gibson.active_tokens (username, expiry_date, \`desc\`)';
              query += 'VALUES (?, ?, ?);';
          var inserts = [username, tomorrow.toISOString().slice(0, 19).replace('T', ' '), config.jwt.type.signup];
          query = mysql.format(query, inserts);

          con.query(query, function(err, results){
            con.release();

            if(err){
              console.log('token.js: Error while inserting into active_tokens table.');
              callback({no:500, msg:'Error generating token.'}, null);
            }
            else{
              var token = jwt.sign({
                token_id: results.insertId,
                iss: config.jwt.issuer,
                user: username,
                type: config.jwt.type.signup
              },
              config.jwt.oneUseSecret, {
                expiresIn: jwt_age
              });

              callback(null, {username: username, email: email, token: token});
            }
          });
        }
      });
    }
  });
}

// FORGOT PASSWORD JWT
function forgotPasswordToken (email, username){

  connection.getConnection(function(err, con){
    if (err){
      console.log('token.js: Error connecting to the database.');
      return;
    }

    else{

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // GENERATING QUERY TO INSERT AN ACTIVE ONE-USE TOKEN
      var query =  'INSERT INTO gibson.active_tokens (username, expiry_date, \`desc\`) VALUES (?, ?, ?);';
      var inserts = [username, tomorrow.toISOString().slice(0, 19).replace('T', ' '), config.jwt.type.forgotpassword];
      query = mysql.format(query, inserts);

      // INSERTING A NEW TOKEN INTO
      con.query(query, function(err, results){
        con.release();

        if (err){
          console.log('token.js: Error inserting one use token');
          res.redirect ('/error');
          return;
        }

        // MAKE TOKEN AND STORE IN req.oneUseToken
         var forgotPasswordToken = jwt.sign({
          token_id: results.insertId,
          iss: config.jwt.issuer,
          user: username,
          type: config.jwt.type.forgotpassword
        },
        config.jwt.oneUseSecret, {
          expiresIn: jwt_age
        });

      // SENDS EMAIL WITH URL TO RESET PASSWORD
      autoemail.forgotpassword(email, username, forgotPasswordToken);
      });
    }
  });
}


// GENERATING JSON WEB TOKEN
function generateToken(req, res, next) {
  // SETTING UP CONNECTION TO THE DATABASE
  connection.getConnection(function(err, con){
    if(err){
      console.log('token.js: Error connecting to the database.');
      res.status(401);
      return err;
    }

    else{
      // QUERING THE DB FOR COMMON secret_key
      con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 1', function(err, results){
        if (err){
          con.release();
          console.log('token.js: Error while querying the database for common secret_key.');
          res.status(401);
          return err;
        }

        // RETRIEVED secret_key
        else{
          req.user.secretKey = results[0].secret_key + req.user.password;

          // NORMAL USER TOKEN, EVERYONE GETS ONE
          req.token = jwt.sign({
            iss: config.jwt.issuer,
            id: req.user.user_id,
            user: req.user.username,
            rank: req.user.rank_id,
            lastLoggedIn: req.user.last_login_time
          },
          req.user.secretKey, {
            expiresIn: jwt_age
          });

          // IF ADMIN, GET THE ADMIN's secret_key
          if (req.user.rank_id > 1){

            async.waterfall([
                function(next){
                    if(req.user.rank_id == 4){
                        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 4', function(err, results1){
                          if (err){
                              console.log('token.js: Error while querying the database for admin secret_key');
                              return next(err);
                          }

                          req.adminToken = jwt.sign({
                            iss: config.jwt.issuer,
                            id: req.user.user_id,
                            user: req.user.username,
                            rank: req.user.rank_id,
                            lastLoggedIn: req.user.last_login_time
                          },
                            results1[0].secret_key, {
                              expiresIn: jwt_age
                          });
                          next(null);
                        });
                    }
                    else{
                        next(null);
                    }
                },

                function(next){
                    if(req.user.rank_id >= 3){
                        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 3', function(err, results2){
                          if (err){
                            console.log('token.js: Error while querying the database for staff secret_key');
                            return next(err);
                          }

                          req.staffToken = jwt.sign({
                            iss: config.jwt.issuer,
                            id: req.user.user_id,
                            user: req.user.username,
                            rank: req.user.rank_id,
                            lastLoggedIn: req.user.last_login_time
                          },
                            results2[0].secret_key, {
                              expiresIn: jwt_age
                          });
                          next(null);
                        });
                    }
                    else{
                        next(null);
                    }
                },

                function(next){
                    if(req.user.rank_id >= 2){
                        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 2', function(err, results3){
                          if (err){
                            console.log('token.js: Error while querying the database for volunteer secret_key');
                            return next(err);
                          }

                          req.volunteerToken = jwt.sign({
                            iss: config.jwt.issuer,
                            id: req.user.user_id,
                            user: req.user.username,
                            rank: req.user.rank_id,
                            lastLoggedIn: req.user.last_login_time
                          },
                            results3[0].secret_key, {
                              expiresIn: jwt_age
                          });
                          next(null);
                        });
                    }
                    else{
                        next(null);
                    }
                }
            ],
            function(err){
                if(err){
                    return err;
                }
                else{
                    next();
                }
            });

          }
          else{
            next();
          }
        }
      });
    }
  });
}


// PLACING THE TOKEN IN A COOKIE (MaxAge in MILLISECONDS)
function respond(req, res, next) {
	res.clearCookie('access_token');
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: cookie_age});
  next();
}

function adminRespond(req,res,next){

  // IF ADMIN, GIVE EXTRA TOKEN (MaxAge in MILLISECONDS)
  if (req.user.rank_id == 4) {
    res.clearCookie('admin');
    res.cookie('admin', req.adminToken, {secure: true, httpOnly: true, maxAge: cookie_age});
  }
  next();
}

function staffRespond(req,res,next){

  // IF ADMIN, GIVE EXTRA TOKEN (MaxAge in MILLISECONDS)
  if (req.user.rank_id >= 3) {
    res.clearCookie('staff');
    res.cookie('staff', req.staffToken, {secure: true, httpOnly: true, maxAge: cookie_age});
  }
  next();
}

function volunteerRespond(req,res,next){

  // IF ADMIN, GIVE EXTRA TOKEN (MaxAge in MILLISECONDS)
  if (req.user.rank_id >= 2) {
    res.clearCookie('volunteer');
    res.cookie('volunteer', req.volunteerToken, {secure: true, httpOnly: true, maxAge: cookie_age});
  }
  next();
}

function sendInfo(req,res,next) {
  res.clearCookie('user_info');
  res.cookie('user_info', {username: req.user.username, rank: req.user.rank_id}, {maxAge: cookie_age});
  next();
}

module.exports.forgotPasswordToken = forgotPasswordToken;
module.exports.generateOneUse = generateOneUse;
module.exports.generateToken = generateToken;
module.exports.respond = respond;
module.exports.adminRespond = adminRespond;
module.exports.staffRespond = staffRespond;
module.exports.volunteerRespond = volunteerRespond;
module.exports.sendInfo = sendInfo;
module.exports.resendToken = resendToken;
