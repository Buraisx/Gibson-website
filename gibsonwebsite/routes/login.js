var express = require('express');
var router = express.Router();


module.exports = function(passport){

//load login page
router.get('/login', function(req,res,next){

	res.render('login', { title: 'Login'});
	
});

//login 
router.post('/login',  passport.authenticate('local-login', {
	successRedirect: '/index',		// Redirect to main page when login complete
	failureRedirect: '/login',	// Return to login when fail, and flash error
	failureFlash: true
	})
);

//logout of account
router.post('/logout', function(req,res,next){

	req.logout();
	res.redirect('/');

});
	return router;
};