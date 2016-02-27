var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = mysql.createPool(config.db_config);

/* GET users listing. */
router.get('/user/profile', function(req, res, next) {

	var decode = jwt.decode(req.cookies.access_token);
	console.log(decode);
	res.send("hello maki chan");
  

});

module.exports = router;
