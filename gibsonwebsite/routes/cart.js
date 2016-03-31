var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var sanitizer = require('sanitizer');

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
        var query = '';

        for (var i = 0; i < req.cookies.cart.course_list.length; i++){
          query += mysql.format('SELECT course_id, course_code, course_name, instructor_username, instructor_name, default_fee, course_limit, payment_period_id, start_date, end_date, course_time, course_interval, course_language, course_days, course_tags, course_target, course_description, instructor_bio, notes FROM gibson.course WHERE course_id = ?;', [req.cookies.cart.course_list[i]]);
        }

        // QUERYING DATABASE FOR COURSE INFORMATION
        con.query(query, function(err, results){

          // FORMATTING THE OUTPUT
          for (var j = 0; j < results.length; j++){
              course_info.push(results[j][0]);
          }

          res.JSON(course_info);
        });
      }

      // CART IS EMPTY
      else{
        res.JSON(course_info);
      }
    }
  });
});

module.exports = router;
