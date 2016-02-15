var express = require('express');
var router = express.Router();

module.exports = function(passport){

//load sign up page
router.get('/', function(req,res,next){

	res.render('signup', { title: 'Sign Up'});
	
});

//create new user
router.post('/', function(req, res, next){


});

	return router;
};

