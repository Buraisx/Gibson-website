var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var sanitizer = require('sanitizer');
var jwt = require('jsonwebtoken');
var token = require('../authentication/token');
var adminFunctions = require('../public/js/bulkQueries');
var readSQL = require('../public/js/readSQL');


//ROUTE FOR VIEWING DETAILED COURSE
router.get('/detailedcourse', function (req, res, next){
    res.render('detailedcourse', { title: 'Staff Portal'});
});

//GET COURSE DATA TO DISPLAY
router.get('/detailedcourse/data', function (req, res, next){
    connection.getConnection(function (err, con){
        if(err){
            res.status(500).send();
        }
        else{
            async.parallel([
                function (next){
                    async.waterfall([
                        function (callback){
                            var sql = "SELECT course_id, course_code, course_name, instructor_username, instructor_name, default_fee, course_limit, DATE_FORMAT(start_date, '%M %D, %Y') start_date, DATE_FORMAT(end_date, '%M %D, %Y') end_date, course_interval, course_language, course_days, course_target, course_description, instructor_bio, categories, notes FROM gibson.course WHERE course_id = ?;";
                            con.query(sql,[req.query.course], function (err, results){
                                if(err){
                                    return callback(err, null);
                                }
                                else{
                                    callback(null, results[0]);
                                }
                            });
                        },
                        function (course, callback){
                            var sql = "SELECT category_id, category_string, category_type FROM gibson.category_matrix WHERE category_id IN (?);";
                            var inserts = [JSON.parse(course.categories)];

                            if(inserts[0].length === 0 || inserts[0] === null){
                                 callback (null, course, []);
                            }
                            else{
                                sql = mysql.format(sql, inserts);
                                con.query(sql, function (err, results){
                                    if(err){
                                        return callback (err, null, null);
                                    }
                                    else{
                                        callback (null, course, results);
                                    }
                                });
                            }
                        }
                        ],function (err, course, results){
                           if(err){
                                return next(err, null);
                           }
                           else{
                                next(null, {course:course, categories:results});
                           }
                    });
                },
                function (next){
                    var sql = "SELECT category_id, category_string, category_type FROM gibson.category_matrix;"
                    con.query(sql, function (err, results){
                        if(err){
                            return next(err, null);
                        }
                        else{
                            next(null, results);
                        }
                    });
                },
                //*** Volunteer+ ONLY FUNCTION ***//
                function (next){
                    var sql = "SELECT u.username,u.fname,u.lname,u.gender,u.address,u.primary_phone,u.primary_extension,u.secondary_phone,u.secondary_extension,u.email FROM gibson.user u INNER JOIN gibson.user_course uc ON u.user_id = uc.user_id WHERE uc.course_id = ?;";
                    var decoded = jwt.decode(req.cookies.volunteer);

                    if(decoded != null && decoded.rank >= 2){
                        con.query(sql, [req.query.course], function (err, results){
                            if(err){
                                return next(err, null);
                            }
                            else{
                                next(null, results);
                            }
                        });
                    }
                    else{
                        next(null, []);
                    }
                    
                },
                function (next){
                    var sql = "SELECT DATE_FORMAT(cd.date, '%W') as day_of_week, DATE_FORMAT(cd.date, '%d') as date, DATE_FORMAT(cd.date, '%M') as month, TIME_FORMAT(cd.start_time, '%h:%i %p') as start_time, TIME_FORMAT(cd.end_time, '%h:%i %p') as end_time FROM gibson.course_days cd INNER JOIN gibson.course c ON c.course_id = cd.course_id WHERE cd.course_id = ?;";
                    con.query(sql, [req.query.course], function (err, results){
                        if(err){
                            return next(err, null);
                        }
                        else{
                            next(null, results);
                        }
                    });
                }
                ],
                function (err, results){
                    con.release();
                    if(err){
                        console.log(err);
                        res.status(500).send();
                    }
                    else{
                        res.status(200).send(results);
                    }
            });
        }
    });
});


module.exports = router;