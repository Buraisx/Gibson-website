var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../server_config');
var authenticate = expressJwt(config.jwt_secret);

router.get('/test_profile', authenticate, function(req, res) {
  res.status(200).json(req.user);
});

module.exports = router;
