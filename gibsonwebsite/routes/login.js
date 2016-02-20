var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var router = express.Router();

module.exports = function(passport){

//load login page
router.get('/login', function(req,res,next){

	res.render('login', { title: 'Login'});

});



// SERLIALIZE/DESERIALIZE MOVED HERE BECAUSE session: false
/*
function serialize (req, res, next) {
	updateOrCreate (req.user, function(err, user){
		if(err) {return next(err);}
    req.user = {
			id: user.user_id,
      username: user.username
    };
    next();
  });
}
function updateOrCreate (user, cb){
  cb(null, user);
}
*/ // DISABLED FOR NOW

// GENERATING JSON WEB TOKEN
function generateToken(req, res, next) {
  req.token = jwt.sign({
		iss: 'https://www.105gibson.com',
		id: req.user.user_id,
    user: req.user.username,
		lastLoggedIn: req.user.last_login_time
  },
	config.jwt_secret.secret, {
    expiresIn: 24*60*60 // 1 day
  });
  next();
}

// SENDING TOKEN TO USER
function respond(req, res) {
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: 24*60*60});
	res.render('index', { title: 'Gibson'});
}

//login
router.post('/login', passport.authenticate('local-login', {
	session: false,
	//successRedirect: '/index',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
}), generateToken, respond);

//logout of account
router.post('/logout', function(req,res,next){

	req.logout();
	res.redirect('/');

});

	return router;
};

// Checks if user is logged in, redirects otherwise.
function isLoggedIn (req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login');
	}
}
