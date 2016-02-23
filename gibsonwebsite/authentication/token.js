var config = require('../server_config');
var jwt = require('jsonwebtoken');

// GENERATING JSON WEB TOKEN
function generateToken(req, res, next) {

  // NORMAL USER TOKEN, EVERYONE GETS ONE
  req.token = jwt.sign({
		iss: config.jwt,
		id: req.user.user_id,
    user: req.user.username,
		lastLoggedIn: req.user.last_login_time
  },
	config.jwt.secret, {
    expiresIn: 14*24*60*60 // 14 day
  });

  // // VOLUNTEER, STAFF, ADMIN TOKENS, ISSUED ACCORDINGLY
  // if (req.user.rank === 'admin'){
  //   req.priviledgeToken = jwt.sign({
  //     // TODO: add some admin information...
  //   },
  //   'some secret', {
  //     expiresIn: 12*60*60 // 12 hours
  //   });
  // }

  next();
}

// SENDING TOKEN TO USER
function respond(req, res) {
	res.clearCookie('access_token');
	res.cookie('access_token', req.token, {secure: true, httpOnly: true, maxAge: 14*24*60*60});
	res.redirect('/');
}

module.exports.generateToken = generateToken;
module.exports.respond = respond;
