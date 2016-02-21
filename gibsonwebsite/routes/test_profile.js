var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');

function authenticate(req, res, next) {

  // LOOKING FOR TOKEN IN COOKIES
  var token = req.cookies.access_token;

  // TOKEN FOUND, TRYING TO VALIDATE
  if (token) {
    try {
      var decoded = jwt.verify(token, config.jwt_secret.secret);
      req.decoded = decoded;
      next();
    }
    catch(err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    }
  }
  // NO TOKEN FOUND
  else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
}

router.get('/test_profile', authenticate, function(req, res) {
      res.render('test_profile', {title: 'User Profile'});
});

module.exports = router;
