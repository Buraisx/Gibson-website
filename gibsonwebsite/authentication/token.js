var config = require('../server_config');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var connection = require('../mysqlpool');
var autoemail = require('./auto_email');

// ONE-TIME TOKEN
function generateOneUse(req, res, next){

  // SETTING UP CONNECTION TO THE DATABASE
  connection.getConnection(function(err, con){
    if (err){
      console.log('token.js: Error connecting to the database.');
      return;
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
        console.log(query);
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
        expiresIn: 24*60*60
      });

      next();
    });
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
          expiresIn: 24*60*60
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
      //res.redirect('/login');
      return err;
    }
    else{
      // QUERING THE DB FOR COMMON secret_key
      con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 1', function(err, results){
        if (err){
          con.release();
          console.log('token.js: Error while querying the database for common secret_key.');
          //res.redirect('/login');
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
            expiresIn: 14*24*60*60 // 14 day
          });
          console.log("user token:" + req.token);

          // IF ADMIN, GET THE ADMIN's secret_key
          if (req.user.rank_id > 1){

            var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = ?';
            secretQuery = mysql.format(secretQuery, req.user.rank_id);

            con.query(secretQuery, function(err, results1){
              con.release();

              if (err){
                console.log('token.js: Error while querying the database for admin secret_key');
                //res.redirect('/login');
                return err;
              }

              req.user.adminSecretKey = results1[0].secret_key;

              // ADMIN -> ISSUE A SECOND TOKEN
              req.adminToken = jwt.sign({
                iss: config.jwt.issuer,
                id: req.user.user_id,
                user: req.user.username,
                rank: req.user.rank_id,
                lastLoggedIn: req.user.last_login_time
              },
                req.user.adminSecretKey, {
                  expiresIn: 12*60*60
          // 12 hours 12 * 60 * 60

              });
              console.log("ADMIN TOKEN:" + req.adminToken);
              next();
            });
            //next();
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
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: 14*24*60*60*1000});

  next();
	//res.redirect('/');
}

function adminRespond(req,res,next){

  // IF ADMIN, GIVE EXTRA TOKEN (MaxAge in MILLISECONDS)
  if (req.user.rank_id > 1) {
    res.clearCookie('privilege');
    res.cookie('privilege', req.adminToken, {secure: true, httpOnly: true, maxAge: 12*60*60*1000});
  }
  next();
}

function sendUsername(req,res,next) {
  res.clearCookie('gibson_user');
  res.cookie('gibson_user', req.user.username, {maxAge: 14*24*60*60*1000});
  next();
}

module.exports.forgotPasswordToken = forgotPasswordToken;
module.exports.generateOneUse = generateOneUse;
module.exports.generateToken = generateToken;
module.exports.respond = respond;
module.exports.adminRespond = adminRespond;
module.exports.sendUsername = sendUsername;
