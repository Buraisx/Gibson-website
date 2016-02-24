var nodemailer = require('nodemailer');
var transport = require('../mailer.js').transport;


// CONFIGURING E-MAIL
var mailOptions = {
  from: '"105 Gibson" <nansagad@gmail.com>',
  to: 'Benjamin.zhao1995@hotmail.com',
  subject: '105 Gibson Automated E-Mail.',
  text: 'Hardcoded for now.',
};


function signupConfirm (req, res, next){
  transport.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return;
    }
    console.log('Message sent: ' + info.response);
    next();
  });
}

module.exports.signupConfirm = signupConfirm;
