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

// RENDERS ADMIN PAGE
router.get('/admin/portal', function(req, res){

    // GETTING CONNECTION
    connection.getConnection(function(err, con){
        if(err){
            console.log('adminqueries.js: Error getting connection; /volunteer/portal');
            res.status(500);
        }
        else{
            //Run Queries in Parallel
            async.parallel({
                province_list: function(next){
                    var sql = "SELECT province_id, province_name FROM gibson.province;";
                    con.query(sql, function (err, results){
                        next(err, results);
                    });
                },
                age_group_list: function(next){
                    var sql = "SELECT age_group_id, age_group_name, age_group_description FROM gibson.age_group;"
                    con.query(sql, function (err, results){
                        next(err, results);
                    });
                }
            },
            //Return results
            function (err, results){
                con.release();
                if(err){
                    console.log('adminqueries.js: Database Query failed');
                    res.status(500).send("Failure");
                }
                else{
                    res.render('adminviews', { title: 'Admin Portal', province_list: results.province_list, age_group_list: results.age_group_list, MAX: 3});
                }
            });
        }
    });
});

// It's very roomy in here LOL.

module.exports = router;
