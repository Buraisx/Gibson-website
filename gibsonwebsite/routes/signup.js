var express = require('express');
var router = express.Router();

module.exports = function(passport){

//load sign up page
router.get('/', function(req,res,next){

	res.render('signup', { title: 'Sign Up'});
	
});

//create new user
router.post('/',  passport.authenticate('signup-local', {
	successRedirect: '/index',		// Redirect to main page when login complete
	failureRedirect: '/index',	// Return to login when fail, and flash error
	failureFlash: true
	})
);
	return router;
};



