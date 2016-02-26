var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../server_config');

// SETTING UP TRANSPORTER
var transport = nodemailer.createTransport(smtpTransport(config.transport));

// SENDING EMAIL
function signupConfEmail (req, res, next){

  // CONFIGURING E-MAIL
  var mailOptions = {
    from: '"105 Gibson" <nansagad@gmail.com>',
    to: 'kevinxu_95@hotmail.com',
    subject: '105 Gibson Confirm Your Email Address',
    text: "Here's your token: " +req.oneUseToken,
  };

  transport.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return;
    }
    console.log('Message sent: ' + info.response);
    next();
  });
}

module.exports.signupConfEmail = signupConfEmail;
