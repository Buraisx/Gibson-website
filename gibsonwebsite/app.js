var express = require('express');
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var expressSession = require('express-session');
var routes = require('./routes/index');
var helmet = require('helmet');
var dnsPrefetchControl = require('dns-prefetch-control');
var whitelist = require('./public_res/whitelist');
//var users = require('./routes/users');
require('./authentication/passport')(passport);

var app = express();
var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(expressSession({
  secret: 'gibson', // session secret
  cookie: { secure: true,
            httpOnly: true
          }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
var signup = require('./routes/signup')(passport);
var login = require('./routes/login')(passport);

app.use('/', routes);
//app.use('/users', users);
app.use('/', signup);
app.use('/', login);

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
app.listen(port);
console.log('Server running on LOCALHOST ' + port);
