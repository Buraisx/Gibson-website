var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var sanitizer = require('sanitizer');
var readSQL = require('../public/js/readSQL');
var paypal = require('paypal-rest-sdk');


// PAYMENT USING PAYPAL ACCOUNT
router.get('/payment/paypal', function(req, res, next){

  paypal.configure(config.paypal_config);

  //
  var payment_json = {
    intent: "sale",
    payer: {
        payment_method: "paypal"
    },
    redirect_urls: {
        return_url: config.domains[0] +"/invoice",
        cancel_url: config.domains[0] +"/cart"
    },
    transactions: [{
        item_list: {
            items: []
        },
        amount: {
            currency: "CAD",
            total: ""
        },
        description: "Signup fee for course(s): "
    }]
  };

  // GETTING DATABSE CONNECTION
  connection.getConnection(function(err, con){
    if (err){
			console.log("payment.js: cannot get connection");
			res.send(400, 'Connection Failed');
			return err;
		}

    // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS:
    async.waterfall([

      // VALIDATING COURSE INFO:
      function(next){
        var course_list = req.cookies.cart.course_list;  // array of course_id

        // CREATING QUERY
        var query = readSQL.getSQL('query_payment.txt');
        var courses = '';

        for (var i = 0; i < req.cookies.cart.course_list.length; i++){
          courses += mysql.escape(req.cookies.cart.course_list[i]);
          courses += ',';
        }

        //Remove ending ,
        courses=courses.slice(0, -1);
        query = query.replace('course_list', courses);

        con.query(query, function(err, results){
          if (err){
            return next({errno: 500, msg: 'Error querying for courses.'}, null);
          }
          else{
            next(null, results);
          }
        });
      },

      // CALL PAYPAL
      function(courseInfo, next){

        var item_list = [];
        var total = 0;
        var desc = '';

        for(var i = 0; i < courseInfo.length; i++){
          item_list.push({
              "name": courseInfo[i].course_name,
              "sku": courseInfo[i].course_code,
              "price": courseInfo[i].default_fee,
              "currency": "CAD",
              "quantity": 1
          });

          total += Number(courseInfo[i].default_fee);
          desc += courseInfo[i].course_code + ', ';
        }
        desc = desc.slice(0, -2);

        payment_json.transactions[0].item_list.items = item_list;
        payment_json.transactions[0].amount.total = total.toString();
        payment_json.transactions[0].description += desc;

        paypal.payment.create(payment_json, function (err, payment) {
          if (err) {
            return next({errno: 500, msg: 'Error creating payment.'}, null);
          }
          else {
            next(null, payment);
          }
        });
      }
    ],
      // THE ENDING FUNCTION
      function(err, payment){
        con.release();

        if(err){
          res.status(err.errno).send(err.msg);
        }
        else{
          var redirectUrl = '';

          for (var i = 0; i < payment.links.length; i++){
            if (payment.links[i].rel == 'approval_url'){
              redirectUrl = payment.links[i].href;
            }
          }
          res.redirect(redirectUrl);
        }
      });
  });
});


module.exports = router;
