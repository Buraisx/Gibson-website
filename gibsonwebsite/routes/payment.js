var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var jwt = require('jsonwebtoken');
var readSQL = require('../public/js/readSQL');
var paypal = require('paypal-rest-sdk');


// PAYMENT USING PAYPAL ACCOUNT
router.get('/payment/paypal', function(req, res, next){

  // CONFIGURING PAYPAL
  paypal.configure(config.paypal_config);

  // PAYMENT JSON
  var payment_json = {
    intent: "sale",
    payer: {
        payment_method: "paypal"
    },
    redirect_urls: {
        return_url: config.domains[0] +"/payment/execute",
        cancel_url: config.domains[0] +"/cart"
    },
    transactions: [{
        item_list: {
            items: []
        },
        amount: {
            currency: "CAD",
            total: "",
            details: {
              tax: 0.00
            }
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
            next(null, results, con);
          }
        });
      },

      // CALL PAYPAL
      function(courseInfo, con, next){
        var id = jwt.decode(req.cookies.access_token).id;
        var item_list = [];
        var total = 0;
        var desc = '';

        for(var i = 0; i < courseInfo.length; i++){
          item_list.push({
              "name": courseInfo[i].course_name,
              "sku": courseInfo[i].course_id,
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

        if(total === 0){
          if(enroll(id, null, "Free", null, null, item_list, total, "CAD", 0, desc, con)){
            return next({errno:200, msg:"Accepted $0.00 transaction."}, null);
          }
          else{
            return next({errno: 500, msg: 'Error accepting $0.00 transaction.'}, null);
          }
        }
        else{
          paypal.payment.create(payment_json, function (err, payment) {
            if (err) {
              return next({errno: 500, msg: 'Error creating payment.'}, null);
            }
            else {
              next(null, payment);
            }
          });
        }
      }],

      // THE ENDING FUNCTION
      function(err, payment){
        con.release();

        if(err.errno === 200){
          res.redirect('/paymentsuccess');
        }
        else if(err){
          res.status(err.errno).send(err.msg);
        }
        else{

          //-------Paypal's Payment Page---------//
          var redirectUrl = '';

          for (var i = 0; i < payment.links.length; i++){
            if (payment.links[i].rel == 'approval_url')
              redirectUrl = payment.links[i].href;
          }
          res.redirect(redirectUrl);
          //---------------------------------------//
        }
      });
  });
});


router.get('/payment/execute', function(req,res,next){

  // CONFIGURING PAYPAL
  paypal.configure(config.paypal_config);

  // GETTING CONNECTION TO DATABASE
  connection.getConnection(function(err, con){
    if (err){
      console.log("payment.js: cannot get connection");
      res.send(400, 'Connection Failed');
      return err;
    }
    else{

      // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS:
      async.waterfall([

        // EXECUTING PAYMENT
        function(next){
          var execute_payment_details = { "payer_id": req.query.PayerID };
          paypal.payment.execute(req.query.paymentId, execute_payment_details, function(error, payment){
            if(error){
              return next({errno:500, msg:"Error executing payment."}, null);
            }
            else {
              next(null, payment);
            }
          });
        },

        //STARTING TRANSACTION WITH THE DATABASE
        function(payment, next){
          con.query('START TRANSACTION;', function(err, results){
            if(err){
              return next({errno:500, msg:"Error starting transaction with database."}, null);
            }
            else{
              next(null, payment);
            }
          });
        },

        // INSERTING INTO PAYMENT INFORMATION INTO gibson.transaction_history
        function(payment, next){
          var decode = jwt.decode(req.cookies.access_token); 
          var sql = "INSERT into gibson.transaction_history (paypal_id, create_time, state, intent, payment_method, user_id, payer_email, payer_first_name, payer_last_name, payer_id, total, currency, tax, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
          var inserts = [payment.id, payment.create_time.replace('T', ' ').replace('Z', ''), payment.state, 
                        payment.intent, payment.payer.payment_method, decode.id,
                        payment.payer.payer_info.email, payment.payer.payer_info.first_name, payment.payer.payer_info.last_name, 
                        payment.payer.payer_info.payer_id, payment.transactions[0].amount.total, payment.transactions[0].amount.currency, 
                        payment.transactions[0].amount.details.tax, payment.transactions[0].description];
          sql = mysql.format(sql, inserts);

          con.query(sql, function(err, results){
            if(err){
              return next({errno: 500, msg:"Error inserting into transaction_history"}, null);
            }
            else{
              next(null, payment, results.insertId);
            }
          });
        },

        // INSERTING USER INTO gibson.user_course
        function(payment, transaction_id, next){

          var decode = jwt.decode(req.cookies.access_token);
          var query_register = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, transaction_id, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, ?, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?;";
          var query = '';

          for (var i = 0; i < payment.transactions[0].item_list.items.length; i++){
            var course_id = payment.transactions[0].item_list.items[i].sku;
            query += mysql.format(query_register, [decode.id, course_id, transaction_id, 'Enrolled', 'Registered for course ID: ' + course_id, course_id]);
          }

          con.query(query, function(err, reg_res){
            if (err){
              return next({errno:500, msg:"Error inserting user into course."}, null);
            }
            else{
              next(null, {message: "Course Registration Successful!"});
            }
          });
        }],

        // FINAL FUNCTION -> HANDLES ERROR/SUCCESS.
        function(error, results){
          if(error){
            con.query('ROLLBACK;', function(err, results){
              con.release();
              console.log(error.msg);
              res.status(error.errno).send("Changes rolledback.");
            });
          }
          else{
            con.query('COMMIT;', function(err, results){
              con.release();
              res.clearCookie('cart');
              //res.status(200).send("User signed up successfully.");
              res.redirect('/paymentsuccess');
            });
          }
        }
      );
    }
  });
});

router.get('/paymentsuccess', function (req, res, next){
  res.render('paymentsuccess', {title: "Payment Success!"});
});


//============================================================
//===Enrollment without payment===============================
//============================================================
function enroll(id, email, payment_method, first_name, last_name, item_list, total, currency, tax, description, con){
  
  async.waterfall([
    
      //Start Transaction
      function (next){
        con.query('START TRANSACTION;', function(err, results){
          if(err){
            return next(new Error("Failure starting enrollment transaction."), null);
          }
          else{
            next(null);
          }
        });
      },

      //Insert transaction into transaction history table
      function (next){
        var user_transaction = "INSERT into gibson.transaction_history (paypal_id, create_time, state, intent, payment_method, user_id, payer_email, payer_first_name, payer_last_name, payer_id, total, currency, tax, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
        var transaction_inserts = [null, new Date(), "Approved", "Purchase", payment_method, id, email, first_name, last_name, null, total, currency, tax, description];

        user_transaction = mysql.format(user_transaction, transaction_inserts);
        con.query(user_transaction, function (err, results){
          if(err){
            return next(new Error("Cannot add transaction to database."), null);
          }
          else{
            next(null);
          }
        });
      },
      
      //Insert all enrollments of each course into the database
      function (next){
        var user_course = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, transaction_id, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, ?, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?;";
        
        for(var i = 0; i < item_list.length; i++){

        }
      } 
    ], function (err, results){
      if(err){
        con.query('ROLLBACK;', function(err, results){
          return false;  
        });
      }
      else{
        con.query('COMMIT;', function(err, results){
          return true;
        });
      }
  });
}

module.exports = router;
