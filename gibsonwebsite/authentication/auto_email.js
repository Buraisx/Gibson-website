var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../server_config');

// SETTING UP TRANSPORTER
var transport = nodemailer.createTransport(smtpTransport(config.transport));

// SENDING EMAIL
function signupConfEmail (req, res, next){

  // IF config.sendEmail = false, DISABLE OUTGOING EMAIL
  if (!config.sendEmail){
    console.log(req.oneUseToken);
    next();
  }
  // config.sendEmail = true, DO SEND EMAIL
  else{

    // CONFIGURING E-MAIL
    var mailOptions = {
      from: '"105 Gibson Centre" <nansagad@gmail.com>',
      to: req.user.email,
      subject: '105 Gibson Centre - Confirmation Email',
      text: ""
    };

    // PLAIN TEXT EMAIL
    mailOptions.text += "Hello " +req.user.username +",\n\nThank you for registering with 105 Gibson Community Centre.";
    mailOptions.text += " To complete the registration process, please click on the following link:\n\n" +req.oneUseToken;
    mailOptions.text += "\n\nIf you did not register, and recieved this email by mistake, please ignore and delete this email.";
    mailOptions.text += "\nThis is an automated email, please do not reply to this email as this email address is not monitored.";
    mailOptions.text += "\n\nThank you,\n105 Gibson Team\nhttps://www.105gibson.com";

    transport.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }
      next();
    });
  }
}

module.exports.signupConfEmail = signupConfEmail;
