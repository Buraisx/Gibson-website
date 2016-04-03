var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var sanitizer = require('sanitizer');
var readSQL = require('../public/js/readSQL');

router.get('/cart', function(req, res, next){
  res.render('cart', {title: 'Your Cart'});
});

router.get('/cart/view', function(req, res, next){

  // GETTING CONNECTION TO DATABASE
  connection.getConnection(function(err, con){
    if(err){
      console.log('cart.js: Error connecting to database.');
      return err;
    }
    else{
      var course_info = [];

      // CART IS NOT EMPTY
      if(req.cookies.cart){

        // CREATING QUERY FOR LIST OF COURSES IN CART
        var query = readSQL.getSQL('query_cart.txt');
        var courses = '';

        for (var i = 0; i < req.cookies.cart.course_list.length; i++){
          courses += mysql.escape(req.cookies.cart.course_list[i]);
          courses += ',';
        }

        //Remove ending ,
        courses=courses.slice(0, -1);
        query = query.replace('course_list', courses);

        // QUERYING DATABASE FOR COURSE INFORMATION
        con.query(query, function(err, results){
          res.send(results);
        });
      }

      // CART IS EMPTY
      else{
        res.send(results);
      }
    }
  });
});

module.exports = router;
