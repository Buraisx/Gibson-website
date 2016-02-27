var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../server_config');

// SETTING UP TRANSPORTER
var transport = nodemailer.createTransport(smtpTransport(config.transport));

// SENDING EMAIL
function signupConfEmail (req, res, next){

  // IF config.sendEmail = false, DISABLE OUTGOING EMAIL
  if (!config.sendEmail){
    next();
  }
  // config.sendEmail = true, DO SEND EMAIL
  else{

    // CONFIGURING E-MAIL
    var mailOptions = {
      from: '"105 Gibson" <nansagad@gmail.com>',
      to: 'kevinxu_95@hotmail.com',
      subject: '105 Gibson Center - Please Confirm Your Email Address',
      text: "Please go to the following web address to confirm your email address: \n https://localhost:3000/confirm/token/" +req.oneUseToken,
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
}

module.exports.signupConfEmail = signupConfEmail;
