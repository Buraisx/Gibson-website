var config = require('../server_config');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');

// SETUP POOLING CONNECTION
var connection = mysql.createPool(config.db_config);

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

    var query =  'INSERT INTO gibson.active_tokens (user_id, username, expiry_date, \`desc\`)';
        query += 'VALUES (?, ?, ?, ?);';
    var inserts = [req.user.user_id, req.user.username, tomorrow.toISOString().slice(0, 19).replace('T', ' '), 'signup confirmation'];
    query = mysql.format(query, inserts);

    // INSERTING A NEW TOKEN INTO
    con.query(query, function(err, results){
      con.release();

      if (err){
        console.log(query);
        console.log('token.js: Error inserting one use token');
        res.redirect ('/');
        return;
      }

      // MAKE TOKEN AND STORE IN req.oneUseToken
      req.oneUseToken = jwt.sign({
        token_id: results.insertId,
        iss: config.jwt.issuer,
        user: req.user.username,
        type: 'signup confirmation'
      },
      config.jwt.oneUseSecret, {
        expiresIn: 24*60*60
      });

      next();
    });
  });
}




// GENERATING JSON WEB TOKEN
function generateToken(req, res, next) {

  // SETTING UP CONNECTION TO THE DATABASE
  connection.getConnection(function(err, con){
    if(err){
      console.log('token.js: Error connecting to the database.');
      res.redirect('/login');
      return;
    }
    else{
      // QUERING THE DB FOR COMMON secret_key
      con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 1', function(err, results){
        if (err){
          con.release();
          console.log('token.js: Error while querying the database for common secret_key.');
          res.redirect('/login');
          return;
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

          // IF ADMIN, GET THE ADMIN's secret_key
          if (req.user.rank_id > 1){

            var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = ?';
            secretQuery = mysql.format(secretQuery, req.user.rank_id);

            con.query(secretQuery, function(err, results){
              con.release();

              if (err){
                console.log('token.js: Error while querying the database for admin secret_key');
                res.redirect('/login');
                return;
              }
              else{
                req.user.adminSecretKey = results[0].secret_key;

                // ADMIN -> ISSUE A SECOND TOKEN
                if (req.user.rank === 'admin'){
                  req.adminToken = jwt.sign({
                    iss: config.jwt.issuer,
                    id: req.user.user_id,
                    user: req.user.username,
                    rank: req.user.rank_id,
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
          console.log(req.user);
          next();
        }
      });
    }
  });
}

// PLACING THE TOKEN IN A COOKIE
function respond(req, res, next) {
	res.clearCookie('access_token');
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: 14*24*60*60});

  // IF ADMIN, GIVE EXTRA TOKEN
  if (req.user.rank_id > 1){
    res.clearCookie('priviledge');
    res.cookie('priviledge', req.adminToken, {secure: true, httpOnly: true, maxAge: 12*60*60});
  }

  next();
	//res.redirect('/');
}

module.exports.generateOneUse = generateOneUse;
module.exports.generateToken = generateToken;
module.exports.respond = respond;
