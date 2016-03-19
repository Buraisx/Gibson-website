var express = require('express');
var router = express.Router();
var connection = require('../mysqlpool');

router.get('/forgotusername', function(req,res,next){

	res.render('forgotusername', {title:'Forgot Username?'});

});

router.get('/forgotpassword', function(req,res,next){

	res.render('forgotpassword', {title:'Forgot Password?'});

});


module.exports = router;