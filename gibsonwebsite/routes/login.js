var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var router = express.Router();
var token = require('../authentication/token');
var email = require('../authentication/auto_email');

module.exports = function(passport){

//load login page
router.get('/login', function(req,res,next){

	res.render('login', { title: 'Login'});

});

// SERLIALIZE MOVED HERE BECAUSE session: false
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

//login
router.post('/login', passport.authenticate('local-login', {
	session: false,
	//successRedirect: '/user/profile',		// Redirect to main page when login complete
	failureRedirect: '/login'	// Return to login when fail, and flash error

}), token.generateToken, token.respond, redirect);

// REDIRECT FOR LOGIN
function redirect(req, res){
	res.redirect('/user/profile');
}

//logout of account
router.post('/logout', function(req,res,next){
	res.clearCookie('access_token');
	res.redirect('/');
});

	return router;
};
