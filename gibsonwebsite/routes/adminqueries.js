var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = mysql.createPool(config.db_config);
var async = require('async');


router.get('/admin/profile', function(req, res, next) {
  res.render('adminviews', { title: 'Admin Profile' });
});

/* Get all users */
router.get('/admin/profile/info', function(req, res) {
    console.log("Getting all user info");

    var decode = jwt.decode(req.cookies.access_token);
    console.log(decode);

    var sql = "SELECT fname, lname, username, email, primary_phone, secondary_phone, gender, birth_date, address, student FROM gibson.user";
    var inserts = decode.id;
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
                console.log("Query error for finding user info");
                return err;
            }

            //check if there is a user with the info
            if(!results.length) {
                console.log("No User");
                return new Error('No user exist.');
            }

            //send all course info to client
            res.json(results);
        });
    });
});

router.post('/admin/profile/addCourse', function(req, res, next){

    var sql = "INSERT INTO gibson.course (course_code, course_name, default_fee, payment_period_id, start_date, end_date, course_time, course_interval, course_target, course_description, course_days) VALUES (?,?,?,2,?,?,?,?,?,?,?);" 
    var inserts = [req.body.addcourseid, req.body.addcoursename, req.body.addcost, req.body.addstartdate, req.body.addenddate, req.body.addtime, req.body.addinterval, req.body.addtarget, req.body.adddescription, req.body.adddays];

    sql = mysql.format(sql, inserts);

    connection.getConnection(function(err,con){

        if(err){
            con.release();
            console.log("cannot get connection");
            return err;
        }

        con.query(sql, function(err, results){
            con.release();
            if(err){
                console.log("Query error for inserting course to datebase");
                res.send(400, "Query error for inserting course to datebase");
                return err;
            }
            res.send(200, "Inserted course successfully");
        });

    });
});



module.exports = router;
