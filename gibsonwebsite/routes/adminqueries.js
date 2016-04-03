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

router.post('/admin/profile/v2', function(req, res){
   var sql = readSQL.getSQL('dml_addcourse.txt');

    language_dml = createLanguageDML(req.body["languages[]"]);
    course_days_dml = createCourseDaysDML(req.body["course_days[]"]);
    adhoc_days_dml = createAdhocDaysDML(req.body["adhoc_days[]"]);

    var inserts = [req.body.addcoursecode, req.body.addcoursename, req.body.instructor_username, req.body.instructor_name, req.body.addcost, req.body.course_limit,
                   req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body.addtarget, req.body.adddescription, 
                   req.body.instructor_bio, ''];

    sql = mysql.format(sql, inserts);
    sql = sql.replace('language_dml', language_dml);
    sql = sql.replace('course_days_dml', course_days_dml);
    console.log(sql);
    
    connection.getConnection(function(err,con){
        if(err){
            con.release();
            console.log("adminqueries.js: cannot get connection");
            return err;
        }
        
        //execute add course DML
        console.log("DML statement addcourse");
        con.query(sql, function(err, results){
            con.release();
            if(err){
                console.log("adminqueries.js: Query error for inserting course to database");
                return next(err);
            }
            adminFunctions.getScheduledDays(results.insertId, req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body["course_days[]"]);       
        });
    });


    res.send("DONE");
});

router.post('/admin/profile/addCourse', function(req, res){
    var sql = readSQL.getSQL('dml_addcourse.txt');

    //Note: *create DML closures apply .shift() on to req.body*
    language_dml = createLanguageDML(req.body["languages[]"]);
    course_days_dml = createCourseDaysDML(req.body["course_days[]"]);
    adhoc_days_dml = createAdhocDaysDML(req.body["adhoc_days[]"]);

    console.log(language_dml);
    console.log(course_days_dml);
    console.log(adhoc_days_dml);

    var inserts = [req.body.addcoursecode, req.body.addcoursename, req.body.instructor_username, req.body.instructor_name, req.body.addcost, req.body.course_limit,
                   req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body.addtarget, req.body.adddescription, 
                   req.body.instructor_bio, ''];

    sql = mysql.format(sql, inserts);
    sql = sql.replace('language_dml', language_dml);
    sql = sql.replace('course_days_dml', course_days_dml);
    console.log(sql);
    
    connection.getConnection(function(err,con){
        if(err){
            con.release();
            console.log("adminqueries.js: cannot get connection");
            return err;
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
                if(adminFunctions.getScheduledDays(course_id, req.body.addstartdate, req.body.addenddate, req.body.addinterval, req.body.course_days)){
                    return new Error('Error adding course schedule');
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

function createLanguageDML(languages){
    var language_dml='';

    languages.shift();

    //Make JSON array for Languages
    language_dml+='JSON_ARRAY(';
    for(var i=0; i < languages.length; i++){
        language_dml+=mysql.escape(languages[i]) + ',';
    }
    //remove last , for languages array
    language_dml=language_dml.slice(0, -1);
    language_dml+=')';
    
    return language_dml;
}

function createCourseDaysDML(course_days){
    var course_days_dml='';

    course_days.shift();

    //Make JSON array for course days
    course_days_dml='JSON_ARRAY(';
    for(var i=0; i < course_days.length; i++){
        var json = JSON.parse(course_days[i]);
        var schedule='JSON_OBJECT(';
        var day = json.day;
        var start_time = json.start_time;
        var end_time = json.end_time;

        schedule+= '\'day\',' +  mysql.escape(day) + ',';
        schedule+= '\'start_time\',' + mysql.escape(start_time) + ',';  
        schedule+= '\'end_time\',' + mysql.escape(end_time);
        schedule+= '),';
        
        course_days_dml+=schedule;
    }
    //remove last , for course days array
    course_days_dml=course_days_dml.slice(0, -1);
    course_days_dml+=')';
    
    return course_days_dml;
}

function createAdhocDaysDML(adhoc_days){
    var adhoc_days_dml='';

    adhoc_days.shift();

    //Make JSON array for adhoc days
    adhoc_days_dml='JSON_ARRAY(';
    for(var i=0; i < adhoc_days.length; i++){
        var json = JSON.parse(adhoc_days[i]);
        var schedule='JSON_OBJECT(';
        var day = json.day;
        var start_time = json.start_time;
        var end_time = json.end_time;

        schedule+= '\'day\',' + mysql.escape(day) + ',';
        schedule+= '\'start_time\',' + mysql.escape(start_time) + ',';  
        schedule+= '\'end_time\',' + mysql.escape(end_time);
        schedule+= '),';
        
        adhoc_days_dml+=schedule;
    }
    //remove last , for adhoc days array
    adhoc_days_dml=adhoc_days_dml.slice(0, -1);
    adhoc_days_dml+=')';

    return adhoc_days_dml;
}

module.exports = router;
