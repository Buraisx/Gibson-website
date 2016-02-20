var express = require('express');
var router = express.Router();
var config = require('../server_config');
var expressJwt = require('express-jwt');

/*router.get('/test_profile', authenticate, function(req, res) {
    res.status(200).json(req.user); , expressJwt(config.jwt_secret)
});*/

router.get('/test_profile', function(req, res) {
    //if (!req.user.admin) return res.sendStatus(401);
    //console.log('TEST: '+req.cookies.access_token);
      //res.render('/test_profile', {title: 'User Profile'});.render('/test_profile', {title: 'User Profile'})
      res.sendStatus(200);
  });


// app.get('/protected',
//   jwt({secret: 'shhhhhhared-secret'}),
//   function(req, res) {
//     if (!req.user.admin) return res.sendStatus(401);
//     res.sendStatus(200);
//   });

module.exports = router;
