var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');

/*router.get('/test_profile', authenticate, function(req, res) {
    res.status(200).json(req.user); , expressJwt(config.jwt_secret)
});*/

router.get('/test_profile', function(req, res) {
    //if (!req.user.admin) return res.sendStatus(401);
    //console.log('TEST: '+req.cookies.access_token);
      //res.render('/test_profile', {title: 'User Profile'});.render('/test_profile', {title: 'User Profile'})
      console.log(req.headers);
      res.sendStatus(200);
  });

  // router.post('/test_profile', function(req, res) {
  //     //if (!req.user.admin) return res.sendStatus(401);
  //     //console.log('TEST: '+req.cookies.access_token);
  //       //res.render('/test_profile', {title: 'User Profile'});.render('/test_profile', {title: 'User Profile'})
  //       res.redirect('/test_profile');
  //   });



// app.get('/protected',
//   jwt({secret: 'shhhhhhared-secret'}),
//   function(req, res) {
//     if (!req.user.admin) return res.sendStatus(401);
//     res.sendStatus(200);
//   });

module.exports = router;

function authenticate(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'g1b50n secret', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
}
