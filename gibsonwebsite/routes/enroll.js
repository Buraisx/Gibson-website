var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var jwt = require('jsonwebtoken');
var readSQL = require('../public/js/readSQL');
var paypal = require('paypal-rest-sdk');

router.get('/enroll', function (req, res, next){

  res.render('enroll', { title: "Enroll a Student"});
  
});

router.get('/enroll/courses', function (req, res, next){

  var sql = "SELECT c.course_id, c.course_code, c.course_name, c.course_limit, uc.user_list from gibson.course c LEFT JOIN (SELECT count(*) AS user_list, course_id from gibson.user_course GROUP BY course_id) uc ON uc.course_id = c.course_id";
  console.log(sql);

  connection.getConnection(function (err, con){
    if(err) {
      con.release();
      console.log("cannot get connection");
      return err;
    }

    con.query(sql, function (err, courses){
      con.release();
      if(err){
        console.log("enroll.js: Cannot query for available courses.");
        res.status(500).send();
      }

      if(!courses.length){
        console.log('enroll.js: No courses');
        res.status(404).send();
      }
      else{
        console.log(courses);
        res.status(200).send(courses);
      }
    });
  });
});

router.post('/enroll/search/user', function (req, res, next){

  var sql = "SELECT user_id, email, fname, lname FROM gibson.user WHERE email = ?;";
  var inserts = req.body.email;
  sql = mysql.format(sql, inserts);
  console.log(sql);

  connection.getConnection(function(err, con) {
    if(err) {
      con.release();
      console.log("cannot get connection");
      return err;
    }

    con.query(sql, function(err, results){
      con.release();
      if(err) {
        console.log("enroll.js: Query error for finding user info");
        res.status(500).send();
      }
            //check if there is a user with the info
      if(!results.length) {
        console.log("enroll.js: No User");
        res.status(404).send(); 
      }
      //send all course info to client
      else{
        res.status(200).send(results);  
      }
    });
  });
});

router.post('/enroll', function (req, res, next){

});

router.post('/enroll/courses', function (req, res, next){
  var sql = "SELECT course_id, course_code, course_name,instructor_name, default_fee, course_limit, start_date,end_date, course_language, course_description FROM gibson.course WHERE course_id IN (course_list);";
  var courses = '';
  var selected_courses = sanitizeJSONArray(req.body["selected_courses[]"]);

  connection.getConnection(function (err, con){
    if(err){
      console.log('enroll.js: Error connecting to database.');
      res.status(401).send();
      return err;
    }
    
    else{
      if(!selected_courses.length){
        
        //Add Courses
        for (var i = 0; i < selected_courses.length; i++){
          courses += mysql.escape(selected_courses[i]);
          courses += ',';
        }

        //Remove ending ,
        courses=courses.slice(0, -1);
        sql = sql.replace('course_list', courses);

        console.log(selected_courses);
        console.log(courses);
        console.log(sql);
        //Query For Selected Course Details
        con.query(sql, function(err, results){
          con.release();
          if(err){
            console.log("enroll.js: Could not get selected courses");
            res.status(404).send();
            return err;
          }

          else{
            res.status(200).send(results);
          }
        });  
      }
      else{
        //EMPTY LIST
        res.status(200).send([]);
      }
    }
  });
});


//============================================================
//===Enrollment without payment===============================
//============================================================
function enroll(id, email, trans_id, payment_method, first_name, last_name, item_list, total, currency, tax, description, con, done){
  
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
        var transaction_inserts = [trans_id, new Date(), "Approved", "Purchase", payment_method, id, email, first_name, last_name, null, total, currency, tax, description];

        user_transaction = mysql.format(user_transaction, transaction_inserts);
        con.query(user_transaction, function (err, results){
          if(err){
            return next(new Error("Cannot add transaction to database."), null);
          }
          else{
            console.log(results.insertId);
            next(null, results.insertId);
          }
        });
      },
      
      //Insert all enrollments of each course into the database
      function (insertId, next){
        async.map(item_list, function (item, callback){
            var user_course = "INSERT INTO gibson.user_course (user_id, course_id, enroll_date, original_price, actual_price, paid, transaction_id, start_date, end_date, status, notes) SELECT  ?, ?, NOW(), default_fee, default_fee, 1, ?, start_date, end_date, ?, ? FROM gibson.course WHERE course_id = ?;";
            var inserts = [id, item.sku, insertId, 'Enrolled', 'Registered for course ID: ' + item.sku, item.sku];
            user_course = mysql.format(user_course, inserts);
            console.log(user_course);
            con.query(user_course, function (err, results){
              if(err){
                callback({errno:500, message:"payment.js: Cannot enroll user into courses"},null);
              }
              else{
                callback(null);  
              }        
            });
        }, function (err, results){
            if(err){
              return next(new Error("Cannot enroll course(s) to database"), null);
            }
            else{
              return next(null, null);
            }
        });
      } 
    ], function (err, results){
      if(err){
        con.query('ROLLBACK;', function(err, results){
          return done({errno: 500, msg: 'Error accepting $0.00 transaction.'}, null); 
          
        });
      }
      else{
        con.query('COMMIT;', function(err, results){
          console.log('payment.js: Enrolled user to courses');
          return done({errno:200, msg:"Accepted $0.00 transaction."}, null);
        });
      }
  });
}

function sanitizeJSONArray (a) {
  if (a == null)
    return [];
  else if (a.constructor === Array)
    return a;
  else return [a];
}


//module.exports = router;
//module.exports = enroll;
module.exports = {
    router: router,
    enroll: enroll
}

