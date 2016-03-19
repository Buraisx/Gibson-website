var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
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

    // READING FILE FOR PLAIN TEXT EMAIL
    fs.readFile('../gibsonwebsite/email_templates/signup_confirmation/text.txt', 'utf-8', function(err, data){
      if (err){
        console.log(err);
        console.log('auto_email.js: Error reading text.txt, signupConfEmail');
        next();
      }
      else{
        // STORING FILE CONTENT TO plain
        var plain = data;

        // READING FILE FOR HTML EMAIL
        fs.readFile('../gibsonwebsite/email_templates/signup_confirmation/html.html', 'utf-8', function(err, data){
          if(err){
            console.log('auto_email.js: Error reading html.html, signupConfEmail');
            next();
          }
          else{
            // STORING FILE CONTENT TO styled
            var styled = data;
            var url = config.domains[0] +'/confirm';

            // CREATE TEMPLATE BASE SENDER FUNCTION
            var sendSignupConf = transport.templateSender({
              subject: '105 Gibson Centre - Signup Confirmation',
              text: plain,
              html: styled
            },
            {
              from: config.transport.auth.user
            });

            // USING TEMPLATE BASE SENDER FUNCTION TO SEND AN EMAIL
            sendSignupConf({
              to: req.user.email,
            },
            {
              username: req.user.username,
              confirmation_url: url,
              token: req.oneUseToken
            },
            function(err, info){
              if (err){
                console.log(err);
                console.log('auto_email.js: Error sending signup confirmation email.');
              }
              next();
            });
          }
        });
      }
    });
  }
}

module.exports.signupConfEmail = signupConfEmail;
