var config = require('../server_config');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');

// SETUP POOLING CONNECTION
var connection = mysql.createPool(config.db_config);

// GENERATING JSON WEB TOKEN
function generateToken(req, res, next) {

  // SETTING UP CONNECTION TO THE DATABASE
  connection.getConnection(function(err, con){
    if(err){
      console.log('token.js: Error connecting to the database.');
      res.redirect('/login');
      return;
    }

    // QUERYING THE DB FOR rank_id
    var rankQuery = 'SELECT rank_id FROM gibson.user WHERE user_id = ?';
    rankQuery = mysql.format(rankQuery, req.user.user_id);

    con.query(rankQuery, function(err, results){

      if (err){
        console.log('token.js: Error while querying the database for rank_id.');
        res.redirect('/login');
        return;
      }
      // RETRIEVED rank_id
      else{
        req.user.rank = results[0].rank_id;

        // QUERING THE DB FOR COMMON secret_key
        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 1', function(err, results){

          if (err){
            console.log('token.js: Error while querying the database for common secret_key.');
            res.redirect('/login');
            return;
          }
          // RETRIEVED secret_key
          else{
            req.user.secretKey = results[0].secret_key;

            // NORMAL USER TOKEN, EVERYONE GETS ONE
            req.token = jwt.sign({
          		iss: config.jwt.issuer,
          		id: req.user.user_id,
              user: req.user.username,
              rank: req.user.rank,
          		lastLoggedIn: req.user.last_login_time
            },
          	req.user.secretKey, {
              expiresIn: 14*24*60*60 // 14 day
            });

            // IF ADMIN, GET THE ADMIN's secret_key
            if (req.user.rank > 1){

              var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = ?';
              secretQuery = mysql.format(secretQuery, req.user.rank);

              con.query(secretQuery, function(err, results){
                con.release();
                if (err){
                  console.log('token.js: Error while querying the database for admin secret_key');
                  res.redirect('/login');
                  return;
                }
                else{
                  req.user.adminSecretKey = results[0].secret_key;

                  // VOLUNTEER, STAFF, ADMIN -> ISSUE A SECOND TOKEN
                  if (req.user.rank === 'admin'){
                    req.priviledgeToken = jwt.sign({
                      iss: config.jwt.issuer,
                      id: req.user.user_id,
                      user: req.user.username,
                      rank: req.user.rank,
                  		lastLoggedIn: req.user.last_login_time
                    },
                    req.user.adminSecretKey, {
                      expiresIn: 12*60*60 // 12 hours
                    });
                  }
                  next();
                }
              });
            }
            next();
          }
        });
      }
    });
  });
}

// SENDING TOKEN TO USER
function respond(req, res) {
	res.clearCookie('access_token');
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: 14*24*60*60});

  // IF ADMIN, GIVE EXTRA TOKEN
  if (req.user.rank > 1){
    res.clearCookie('priviledge');
    res.cookie('priviledge', req.priviledgeToken, {secure: true, httpOnly: true, maxAge: 12*60*60});
  }

	res.redirect('/');
}

module.exports.generateToken = generateToken;
module.exports.respond = respond;
