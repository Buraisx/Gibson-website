var express = require('express');
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var expressSession = require('express-session');
var mysql = require ('mysql');
var routes = require('./routes/index');
var helmet = require('helmet');
var dnsPrefetchControl = require('dns-prefetch-control');
var jwt = require('jsonwebtoken');
var config = require('./server_config');
var whitelist = require('./public_res/whitelist');
var connection = require('./mysqlpool');

//CSRF Protection
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

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
var test_profile = require('./routes/test_profile');
var confirm = require('./routes/confirm');
var error = require('./routes/error');
var adminPages = require('./routes/adminqueries');
var forgotcreds = require('./routes/forgotcredentials');
var resetpassword = require('./routes/resetpassword');
var cart = require('./routes/cart');

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

          // CONCATENATE THE PASSWORD TO THE END OF THE RANK'S SECRET KEY
          secretKey += password[0].password;

          // VERIFYING TOKEN
          jwt.verify(token, secretKey, function(err, userInfo){
            if (err){
              con.release();
              console.log('app.js: Error verifying token.');
              //res.end();
              res.redirect(401, '/logout');
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
    res.redirect('/login');
  }

});
// =============================================
// ===↓↓↓↓↓ AUTHENTICATION NEEDED BELOW ↓↓↓↓↓===
// =============================================
app.use('/', users);
app.use('/', cart);


//======↓↓↓↓↓AUTHENTICATION FOR ADMIN =========

app.use(function (req, res, next){

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.privilege;
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

      if (decoded.rank > 1){
              // SETTING UP QUERIES NEEDED
          var secretQuery = 'SELECT secret_key FROM gibson.rank WHERE rank_id = ?;';
          secretQuery = mysql.format(secretQuery, decoded.rank);

        // QUERYING THE DATABASE FOR SECRET KEY
        con.query(secretQuery, function(err, results){
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
// =============================================
//routes under here are admin only routes

app.use('/', test_profile);
app.use('/', adminPages);

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
