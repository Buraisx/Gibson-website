var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../server_config');
//var token = require('../authentication/token');
//var email = require('../authentication/auto_email');

//load sign up page
router.get('/userprofile', function(req,res,next){
  // CREATING CONNECTION
  var connection = mysql.createPool(config.db_config);

  // MAKING THE QUERY STRING
  var sql = "SELECT * FROM gibson.user;";

  //query to look for the province names and the their respective province ids
  connection.getConnection(function(err, con)
  {
      con.query(sql,function(err, results)
      {
          con.release();
          //Sends Sign up Title, List of Canada Provinces, Max emergency contact
          res.render('userprofile', { title: 'Sign Up', user_info: results });
      });
  });
});


module.exports = router;
