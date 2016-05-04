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


router.get('/admin/portal', function(req, res, next) {
  res.render('adminviews', { title: 'Admin Profile' });
});

// It's very roomy in here LOL.

module.exports = router;
