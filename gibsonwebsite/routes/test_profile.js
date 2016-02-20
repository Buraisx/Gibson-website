var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('express-jwt');

/*router.get('/test_profile', authenticate, function(req, res) {
    res.status(200).json(req.user);
});*/

router.get('/test_profile', jwt(config.jwt_secret), function(req, res) {
    //if (!req.user.admin) return res.sendStatus(401);
    console.log(req.user);
      //res.render('/test_profile', {title: 'User Profile'});
      res.sendStatus(200);
  });

module.exports = router;
