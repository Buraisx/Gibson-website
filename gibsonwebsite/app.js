var express = require('express');
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var expressSession = require('express-session');
var mysql = require ('mysql');
var async = require('async');
var routes = require('./routes/index');
var helmet = require('helmet');
var dnsPrefetchControl = require('dns-prefetch-control');
var jwt = require('jsonwebtoken');
var config = require('./server_config');
var whitelist = require('./public_res/whitelist');
var connection = require('./mysqlpool');
var enroll = require('./routes/enroll').router;
var detailedCourse = require('./routes/detailedcourse');


//CSRF Protection
var csrf = require('csurf');
var csrfProtection = csrf({Secure:true, cookie: true});

//HTTPS AND READ FILE SYNC
var https = require('https');
var fs = require('fs');
var users = require('./routes/users');
require('./authentication/passport')(passport);

var cred = {
  key: fs.readFileSync('./cert/my_key.key', 'utf8'),
  cert: fs.readFileSync('./cert/my_cert.crt', 'utf8')
};

var app = express();
var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/public'));


//implement csrf
app.use(csrfProtection);

app.use(function (req, res, next)
{
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use(function (err, req, res, next){
  if(err.code !== 'EBADCSRFTOKEN')
    return next(err);

  //Handle CSRF token errors
  res.status(403);
  console.log('Session Tampered with');
  return done(err);
});


// Security
app.use(helmet());
app.use(dnsPrefetchControl({ allow: false }));
app.use(helmet.csp({
  defaultSrc: ['self'],
  scriptSrc: whitelist.scriptSrc,
  styleSrc: whitelist.styleSrc,
  imgSrc: [],
  connectSrc: ["'none'"],
  fontSrc: ['/public/font-awesome/css/*'],
  objectSrc: []
}));

// required for passport
// app.use(expressSession({
//   secret: 'session secret',
// }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var signup = require('./routes/signup')(passport);
var login = require('./routes/login')(passport);
var developer = require('./routes/developer');
var confirm = require('./routes/confirm');
var error = require('./routes/error');
var adminPages = require('./routes/adminqueries');
var forgotcreds = require('./routes/forgotcredentials');
var resetpassword = require('./routes/resetpassword');
var cart = require('./routes/cart');
var payment = require('./routes/payment');
var invoice = require('./routes/invoice');
var volunteer = require('./routes/volunteer.js');
var staff = require('./routes/staff.js');

// ================================================
// ===ALWAYS LOOK FOR ALERTS ======================
// ================================================
 app.use(function (req, res, next){
    connection.getConnection(function(err, con){
       if(err){
         console.log('app.js: Cannot get alerts');
         next();
       }
       else{
         con.query('SELECT alert_msg, alert_type FROM gibson.website_alert WHERE start_alert=1', function(err, results){
           con.release();
           if(results == null || !results.length){
             res.clearCookie('gibson_alert');
             next();
           }
           else{
             res.cookie('gibson_alert', results, {secure:true});
             next();
           }
         });
       }

    });
});


app.use('/', routes);
app.use('/', signup);
app.use('/', login);
app.use('/', confirm);
app.use('/', error);
app.use('/', forgotcreds);
app.use('/', resetpassword);

// ================================================
// ===↑↑↑↑↑ NO AUTHENTICATION NEEDED ABOVE ↑↑↑↑↑===
// ================================================

app.use(function (req, res, next){
  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.access_token;
  var decoded = jwt.decode(token);

  async.waterfall([

    //CHECK IF TOKEN EXISTS
    function (next){
      if(token){
        next(null);
      }
      else{
        return next(new Error ('No Authenticated Token'), null);
      }
    },

    //GET CONNECTION
    function (next){
      connection.getConnection(function (err, con){
        if(err){
          return next(new Error ('app.js: Error connecting to DB'), con);
        }
        else{
          next(null, con);
        }
      });
    },

    //QUERY FOR SECRET KEY
    function (con, next){
      // SETTING UP QUERIES NEEDED
      var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = 1;';
      //secretQuery = mysql.format(secretQuery, decoded.rank);

      // QUERYING THE DATABASE FOR SECRET KEY
      con.query(secretQuery, function(err, results){
        if(err){
          return next(new Error ('app.js: Error querying the Database for secret_key'), con);
        }
        else if(!results.length){
          return next(new Error ('app.js: Error No Secret Key Found.'), con);
        }
        else{
          next(null, con, results[0].secret_key);
        }
      });
    },

    // QUERYING THE DATABASE FOR USER'S PASSWORD
    function (con, secret_key, next){
      var passwordQuery = 'SELECT password FROM gibson.user WHERE user_id = ?;';
      passwordQuery = mysql.format(passwordQuery, decoded.id);

      con.query(passwordQuery, function(err, results){
        if(err){
          return next(new Error('app.js:Error querying database for password'), con);
        }
        else if(!results.length){
          return next(new Error('app.js:Error no password for user found'), con);
        }
        else{
          next(null, con, secret_key+results[0].password);
        }
      });
    },

    //VERIFY TOKEN
    function (con, full_key, next){
      jwt.verify(token, full_key, function(err, userInfo){
        if(err){
          return next(new Error('app.js:Could not verify user token'), con);
        }
        else{
          req.decoded = userInfo;
          next(null, con);
        }
      });
    }
    ],function (err, con){
        if(con!=null){
          con.release();
        }
        if(err){
          res.clearCookie('access_token');
          res.clearCookie('admin');
          res.clearCookie('volunteer');
          res.clearCookie('staff');
          res.clearCookie('user_info');
          //res.status(401).json({redirect_url: 'login'});
          res.redirect('/login');
          //res.end();
        }
        else{
          next();
        }
  });
});
/*

// AUTHENTICATION FUNCTION - CHECKS THE TOKEN IN COOKIE
app.use(function (req, res, next){

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.access_token;
  var decoded = jwt.decode(token);

  // TOKEN FOUND, TRYING TO VALIDATE
  if (token){
    // CREATING CONNECTION
    //// var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
  		if (err){
        console.log('app.js: Error connecting to the DB.');
        //res.end();
        return err;
      }

      // SETTING UP QUERIES NEEDED
      var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = 1;';
      //secretQuery = mysql.format(secretQuery, decoded.rank);
      var passwordQuery = 'SELECT password FROM gibson.user WHERE user_id = ?;';
      passwordQuery = mysql.format(passwordQuery, decoded.id);

      // QUERYING THE DATABASE FOR SECRET KEY
      con.query(secretQuery, function(err, results){
        if (err){
          con.release();
          console.log('app.js: Error querying the Database for secret_key');
          //res.end();
          return err;
        }

        var secretKey = results[0].secret_key;

        // QUERYING THE DATABASE FOR USER'S PASSWORD
        con.query(passwordQuery, function(err, password){
          if (err){
            con.release();
            console.log('app.js: Error querying the Database for password');
            //res.end();
            return err;
          }
		      if (!password.length) {
			       return err;
		      }
          // CONCATENATE THE PASSWORD TO THE END OF THE RANK'S SECRET KEY
          secretKey += password[0].password;

          // VERIFYING TOKEN
          jwt.verify(token, secretKey, function(err, userInfo){
            if (err){
              con.release();
              console.log('app.js: Error verifying token.');
              //res.end();
			        res.clearCookie('access_token');
			        res.clearCookie('privilege');
			        res.clearCookie('user_info');
              res.status(401).send("BAD TOKEN");
            }
            else{
              con.release();
              req.decoded = userInfo;
              next();
            }
          });

        });
      });
  	});
  }
  // NO TOKEN FOUND -> REDIRECTS TO LOGIN TO GET A TOKEN
  else {
    //res.end();
	console.log('No Token');
	res.clearCookie('access_token');
	res.clearCookie('privilege');
	res.clearCookie('user_info');
	res.status(401).send("NO TOKEN");
    //window.location.replace('/login');
  }

});
*/


// =============================================
// ===↓↓↓↓↓ AUTHENTICATION NEEDED BELOW ↓↓↓↓↓===
// =============================================
app.use('/', users);
app.use('/', cart);
app.use('/', payment);
app.use('/', invoice);
app.use('/', detailedCourse);

// ==========================================================
// ===↑↑↑↑↑ NO VOLUNTEER AUTHENTICATION NEEDED ABOVE ↑↑↑↑↑===
// ==========================================================
app.use(function (req, res, next){

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.volunteer;
  var decoded = jwt.decode(token);

  // TOKEN FOUND, TRYING TO VALIDATE
  if (token){
    // CREATING CONNECTION
    // var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
      if (err){
        console.log('app.js: Error connecting to the DB.');
        //res.end();
        return err;
      }

      if (decoded.rank >= 2){

        // QUERYING THE DATABASE FOR SECRET KEY
        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 2;', function(err, results){
          if (err){
            con.release();
            console.log('app.js: Error querying the Database for secret_key');
          //  res.end();
            return err;
          }

          var secretKey = results[0].secret_key;

          // VERIFYING TOKEN
          jwt.verify(token, secretKey, function(err, volunteerInfo){
            if (err){
              con.release();
              console.log('app.js: Error verifying token.');
            //  res.end();
              return err;
            }
            else{
              con.release();
              next();
            }
          });

        });
      }
      else{
        return err;
      }

    });
  }
  // NO TOKEN FOUND -> REDIRECTS TO LOGIN TO GET A TOKEN
  else {
    //res.end();
    return err;
  }
});
// =======================================================
// ===↓↓↓↓↓ VOLUNTEER AUTHENTICATION NEEDED BELOW ↓↓↓↓↓===
// =======================================================

app.use('/', volunteer);
app.use('/', enroll);

// ======================================================
// ===↑↑↑↑↑ NO STAFF AUTHENTICATION NEEDED ABOVE ↑↑↑↑↑===
// ======================================================
app.use(function (req, res, next){

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.staff;
  var decoded = jwt.decode(token);

  // TOKEN FOUND, TRYING TO VALIDATE
  if (token){
    // CREATING CONNECTION
    // var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
      if (err){
        console.log('app.js: Error connecting to the DB.');
        //res.end();
        return err;
      }

      if (decoded.rank >= 3){

        // QUERYING THE DATABASE FOR SECRET KEY
        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 3;', function(err, results){
          if (err){
            con.release();
            console.log('app.js: Error querying the Database for secret_key');
          //  res.end();
            return err;
          }

          var secretKey = results[0].secret_key;

          // VERIFYING TOKEN
          jwt.verify(token, secretKey, function(err, volunteerInfo){
            if (err){
              con.release();
              console.log('app.js: Error verifying token.');
            //  res.end();
              return err;
            }
            else{
              con.release();
              next();
            }
          });

        });
      }
      else{
        return err;
      }

    });
  }
  // NO TOKEN FOUND -> REDIRECTS TO LOGIN TO GET A TOKEN
  else {
    //res.end();
    return err;
  }
});
// ===================================================
// ===↓↓↓↓↓ STAFF AUTHENTICATION NEEDED BELOW ↓↓↓↓↓===
// ===================================================

app.use('/', staff);

// ======================================================
// ===↑↑↑↑↑ NO ADMIN AUTHENTICATION NEEDED ABOVE ↑↑↑↑↑===
// ======================================================
app.use(function (req, res, next){

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.admin;
  var decoded = jwt.decode(token);

  // TOKEN FOUND, TRYING TO VALIDATE
  if (token){
    // CREATING CONNECTION
    // var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
      if (err){
        console.log('app.js: Error connecting to the DB.');
        //res.end();
        return err;
      }

      if (decoded.rank == 4){

        // QUERYING THE DATABASE FOR SECRET KEY
        con.query('SELECT secret_key FROM gibson.rank WHERE rank_id = 4;', function(err, results){
          if (err){
            con.release();
            console.log('app.js: Error querying the Database for secret_key');
          //  res.end();
            return err;
          }

          var secretKey = results[0].secret_key;

          // VERIFYING TOKEN
          jwt.verify(token, secretKey, function(err, adminInfo){
            if (err){
              con.release();
              console.log('app.js: Error verifying token.');
            //  res.end();
              return err;
            }
            else{
              con.release();
              next();
            }
          });

        });
      }
      else{
        return err;
      }

    });
  }
  // NO TOKEN FOUND -> REDIRECTS TO LOGIN TO GET A TOKEN
  else {
    //res.end();
    return err;
  }
});
// ===================================================
// ===↓↓↓↓↓ ADMIN AUTHENTICATION NEEDED BELOW ↓↓↓↓↓===
// ===================================================
app.use('/', adminPages);
app.use('/', developer);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var httpsServer = https.createServer(cred, app);

httpsServer.listen(port);
console.log('Server running on LOCALHOST ' + port);
