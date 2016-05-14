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
      res.status(500).send();
    }
    else{
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
          con.release();
        });
      }

      // CART IS EMPTY
      else{
        res.send([]);
      }
    }
  });
});

router.post('/cart/course/delete', function(req, res, next){

      if(req.cookies.cart.course_list.indexOf(Number(req.body.course_id)) == -1){

        console.log("cart.js: Cannot delete the course because does not exist in shopping cart list.");
        res.status(500).send("Cannot delete the course because does not exist in shopping cart list.");

      }
      else{
        
        var courseCart = {
                course_list: []};

        for(var i = 0; i < req.cookies.cart.course_list.length; i++){
          //iterate through the courses in the shopping cart and delete the one that is pressed
          if(req.cookies.cart.course_list[i] != Number(req.body.course_id)){
            courseCart.course_list.push(req.cookies.cart.course_list[i]);
          }
        }

        console.log(courseCart);
        //
        res.clearCookie('cart');
        res.cookie('cart', courseCart , {maxAge: 30*24*60*60*1000});
        res.status(200).send('Course deleted from the cart.');
        //
        
      }
});

module.exports = router;
