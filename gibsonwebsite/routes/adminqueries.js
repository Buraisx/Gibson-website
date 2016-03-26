var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var adminFunctions = require('../public/js/bulkQueries');
var readSQL = require('../public/js/readSQL');


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
            res.send(results);
        });
    });
});

router.get('/admin/profile/courses', function(req, res){
    console.log("adminqueries.js: Getting registered courses");

    var sql = "SELECT course_id, course_name, default_fee, start_date, end_date, course_time, course_interval, course_target, course_description, course_days FROM gibson.course ORDER BY course_id DESC";
    console.log(sql);

    connection.getConnection(function(err, con){
        if(err){
            con.release();
            console.log("adminqueries.js: Cannot get connection");
            return err;
        }

        con.query(sql, function(err, results){
            con.release();

            if(err){
                console.log("adminqueries.js: Query error for finding courses");
                return err;
            }

            //check if there is a user with the info
            if(!results.length){
                console.log("adminqueries.js: No courses found!");
            }

            //send all course info to client
            //console.log(results);
            res.send(results);
        });
    });
});

/*
router.get('/admin/profile/addCourse', function(req, res){
    res.sendStatus(200);
});
*/

router.post('/validateCourse', function(req, res){
    //validate the course name and course code
    var sql = "SELECT course_id FROM gibson.course WHERE course_name = ? OR course_code = ?;";
    var inserts = [req.body.course_name, req.body.course_code];

    sql = mysql.format(sql, inserts);

    connection.getConnection(function(err, con){
        con.query(sql, function(err, results){
            con.release();
            console.log(results);
            if(err){
                res.send(new Error("err querying"));
            }

            if(!results.length){
                res.send("adminqueries.js: Validated!");
            }   

            else{
                res.send(new Error("adminqueries.js: Course name or course code already exists!"));
            }
        });
    });
});

router.post('/v2', function(req, res){
    req.body["languages[]"].shift();
    req.body["course_days[]"].shift();
    req.body["adhoc_days[]"].shift();

    console.log(readSQL.getSQL('dml_addcourse.txt'));
    console.log(req.body["languages[]"]);
    console.log(req.body["course_days[]"]);
    console.log(req.body["adhoc_days[]"]);

    res.send("DONE");
});

router.post('/admin/profile/addCourse', function(req, res){
	// instructor_username is set to null
    var sql = readSQL.getSQL('dml_addcourse.txt');
    // make json dml for course days because gay
    var a = req.body["course_days[]"];
    var b = req.body["languages[]"];
    a.shift();
    b.shift();
    var lang_dml = "JSON_ARRAY(";
    var days_dml = "JSON_ARRAY(";
    
    console.log(lang_dml);
    for (k in a) {
        var obj = JSON.parse(k);
        

    }
    days_dml = days_dml.slice(0, -1) + ")";
    console.log(days_dml);



    var inserts = [req.body.addcoursecode, req.body.addcoursename, req.body.instructor_username, req.body.instructor_name, req.body.addcost, req.body.course_limit,
				   req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body["languages[]"], req.body["course_days[]"], req.body.addtarget, req.body.adddescription, 
                   req.body.instructor_bio, req.body.notes];

    sql = mysql.format(sql, inserts);

    console.log(sql);
    connection.getConnection(function(err,con){

        if(err){
            con.release();
            console.log("adminqueries.js: cannot get connection");
            return next(err);
        }

        async.waterfall([
            function (next){
                con.query("START TRANSACTION;", function(err, results){
                    if(err){
                        console.log("adminqueries.js: Cannot start transactions.");
                        return next(err);
                    }

                    next();
                });
            },

            function (next){
                console.log("DML statement addcourse");
                con.query(sql, function(err, results){
                    if(err){
                        console.log("adminqueries.js: Query error for inserting course to database");
                        return next(err);
                    }
                    console.log(results.insertId);
                    next(results.insertId);        
                });
            },

            function (course_id, next){
                console.log("DML statement add course days");
                var all_days = adminFunctions.getScheduledDays(course_id, req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body.course_days);
                for(i = 0; i < all_days.length; i++){
                    con.query(all_days[i], function(err, results){
                        if(err){
                            console.log("adminqueries.js: " + all_days[i] + " FAILED!");
                            return next(err);
                        }
                    });
                }
                next(null, null);
            }
        ],
        function (err, results){
            console.log("END");
            if(err){
                con.query("ROLLBACK;", function(err, results){
                    con.release();
                    console.log("adminqueries.js: Rollbacked because " + err);
                    return err;
                });
            }

            else{
                con.query("COMMIT;", function(err, results){
                    con.release();
                    console.log("adminqueries.js: Commited course!");
                    res.redirect('/admin/profile');
                });
            }
        });
    });
});


module.exports = router;
