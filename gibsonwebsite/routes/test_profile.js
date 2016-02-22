var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');

router.get('/test_profile', function(req, res) {
      res.render('test_profile', {title: 'User Profile'});
});

module.exports = router;
