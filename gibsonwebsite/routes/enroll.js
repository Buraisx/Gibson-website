var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var jwt = require('jsonwebtoken');
var readSQL = require('../public/js/readSQL');
var paypal = require('paypal-rest-sdk');
var bcrypt = require('bcrypt-nodejs');

//load html page of enroll UI
router.get('/enroll', function (req, res, next){

  res.render('enroll', { title: "Enroll a Student"});
  
});

//search for the user's information given the email 
router.post('/enroll/search/user', function (req, res, next){

  var sql = "SELECT user_id, email, fname, lname FROM gibson.user WHERE email = ?;";
  var inserts = req.body.email;
  sql = mysql.format(sql, inserts);

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

//load all available courses to the user
router.get('/enroll/courses', function (req, res, next){

  var sql = "SELECT c.course_id as sku, c.course_code, c.course_name, c.course_limit, uc.user_list from gibson.course c LEFT JOIN (SELECT count(*) AS user_list, course_id from gibson.user_course GROUP BY course_id) uc ON uc.course_id = c.course_id";

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

//give frontend all the course information for the courses they selected
router.post('/enroll/courses', function (req, res, next){
  var sql = "SELECT course_id AS sku, course_code, course_name,instructor_name, default_fee, course_limit, start_date,end_date, course_language, course_description FROM gibson.course WHERE course_id IN (course_list);";
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
        //EMPTY LIST
        res.status(200).send([]);
      }
      else{
        //Add Courses
        for (var i = 0; i < selected_courses.length; i++){
          courses += mysql.escape(selected_courses[i]);
          courses += ',';
        }
        //Remove ending ,
        courses=courses.slice(0, -1);
        sql = sql.replace('course_list', courses);

        //Query For Selected Course Details
        con.query(sql, function(err, results){
          con.release();
          if(err){
            console.log("enroll.js: Could not get selected courses");
            res.status(404).send();
            return err;
          }

          else{
            console.log(results);
            res.status(200).send(results);
          }
        });
      }
    }
  });
});

//enroll the user into the course
router.post('/enroll', function (req, res, next){

    var sql ="SELECT password FROM gibson.user WHERE user_id = ?";
    var inserts = jwt.decode(req.cookies.access_token).id;
    sql = mysql.format(sql, inserts);

    connection.getConnection(function (err, con){
    if(err) {
      con.release();
      console.log("enroll.js: Cannot get connection.");
      return err;
    }

    else{
        async.waterfall([

        //check password
        function (next){
          con.query(sql, function (err, password){
            if(err){
              console.log("enroll.js: Cannot query for password.");
              return next({errno:401, msg:"Cannot query for password."}, null);
            }

            else if (req.body.password == null || !req.body.password.length){
              return next({errno:401, msg:"No Password Provided!"}, null);
            }

            else if (!bcrypt.compareSync(req.body.password, password[0].password)){
              console.log('enroll.js: Bad password given.');
              return next({errno:401, msg:"Bad Password!"}, null);
            }
            
            else{

              next(null, req.body.user_id, req.body.email, req.body.trans_id, req.body.payment_method, req.body.first_name, req.body.last_name, JSON.parse(req.body.item_list), req.body.total, 'CAD', '0.00', req.body.description, con, next);
            }
          });
        },

        //Enrollment
        function (id, email, trans_id, payment_method, first_name, last_name, item_list, total, currency, tax, description, con, done){
          enroll(id, email, trans_id, payment_method, first_name, last_name, item_list, total, currency, tax, description, con, done);  
        }
      ],
      function (msg, results){
        con.release();
        if(msg){
          console.log("enroll.js: " + msg.msg);
          res.status(msg.errno).send();
        }
      }); 
    }
  }); 
});

router.get('/enrollSuccess', function (req, res, next){

  res.render('enrollSuccess', { title: "Enroll Success!"});

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
        var user_transaction = "INSERT into gibson.transaction_history (payment_id, create_time, state, intent, payment_method, user_id, payer_email, payer_first_name, payer_last_name, payer_id, total, currency, tax, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
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
          return done({errno: 500, msg: 'Error accepting $' + total + ' transaction.'}, null); 
        });
      }
      else{
        con.query('COMMIT;', function(err, results){
          console.log('payment.js: Enrolled user to courses');
          return done({errno:200, msg:"Accepted $" + total + " transaction."}, null);
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

module.exports = {
    router: router,
    enroll: enroll
}

