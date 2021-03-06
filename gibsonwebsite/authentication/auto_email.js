var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var config = require('../server_config');

// SETTING UP TRANSPORTER
var transport = nodemailer.createTransport(smtpTransport(config.transport));

// SIGNUP CONFIRMATION EMAIL
function signupConfEmail (req, res, next){

  // IF config.sendEmail = false, DISABLE OUTGOING EMAIL
  if (!config.sendEmail){
    console.log('\n' +req.user.username +'\'s E-MAIL CONFIRMATION URL:');
    console.log(config.domains[0] +'/confirm?token=' +req.oneUseToken +'\n');
    next();
  }
  // config.sendEmail = true, DO SEND EMAIL
  else{

    // READING FILE FOR PLAIN TEXT EMAIL
    fs.readFile('../gibsonwebsite/email_templates/signup_confirmation/text.txt', 'utf-8', function(err, data){
      if (err){
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
              subject: 'Signup Confirmation',
              text: plain,
              html: styled
            },
            {
              from: '105 Gibson Centre <' +config.transport.auth.user +'>'
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


// FUNCTION TO RESEND SIGNUP CONFIRMATION EMAIL
function resendSignupEmail(userInfo, callback){

  // IF config.sendEmail = false, DISABLE OUTGOING EMAIL
  if (!config.sendEmail){
    console.log('\n' +userInfo.username +'\'s E-MAIL CONFIRMATION URL:');
    console.log(config.domains[0] +'/confirm?token=' +userInfo.token +'\n');
    callback(null);
  }
  else{

    // READING FILE FOR PLAIN TEXT EMAIL
    fs.readFile('../gibsonwebsite/email_templates/signup_confirmation/text.txt', 'utf-8', function(err, data){
      if(err){
        console.log('auto_email.js: Error reading text.txt; resendSignupEmail');
        callback({no:500, msg:'Error while sending email.'});
      }
      else{

        var plain = data;

        fs.readFile('../gibsonwebsite/email_templates/signup_confirmation/html.html', 'utf-8', function(err, data){
          if(err){
            console.log('auto_email.js: Error reading html.html; resendSignupEmail');
            callback({no:500, msg:'Error while sending email.'});
          }
          else{

            var styled = data;
            var url = config.domains[0] +'/confirm';

            // CREATE TEMPLATE BASE SENDER FUNCTION
            var sendSignupConf = transport.templateSender({
              subject: 'Signup Confirmation',
              text: plain,
              html: styled
            },
            {
              from: '105 Gibson Centre <' +config.transport.auth.user +'>'
            });

            // USING TEMPLATE BASE SENDER FUNCTION TO SEND AN EMAIL
            sendSignupConf({
              to: userInfo.email,
            },
            {
              username: userInfo.username,
              confirmation_url: url,
              token: userInfo.token
            },
            function(err, info){
              if (err){
                console.log('auto_email.js: Error resending signup confirmation email.');
                callback({no:500, msg:'Error while sending email.'});
              }
              else{
                callback(null);
              }
            });
          }
        });
      }
    });
  }
}



// USERNAME REMINDER EMAIL
function usernameReminder(email, username, next){

  fs.readFile('../gibsonwebsite/email_templates/username_reminder/text.txt', 'utf-8', function(err, data){
    if(err){
      console.log('auto_email.js: Cannot read text.txt for usernameReminder');
      return err;
    }
    else{

        var plain = data;

        fs.readFile('../gibsonwebsite/email_templates/username_reminder/html.html', 'utf-8', function(err, data){
          if(err){
            console.log('auto_email.js: Cannot read html.html for usernameReminder');
            return err;
          }
          else{
              var styled = data;

              // CREATE TEMPLATE BASE SENDER FUNCTION
              var sendReminder = transport.templateSender({
                subject: 'Account Information',
                text: data,
                html: styled
              },
              {
                from: '105 Gibson Centre <' +config.transport.auth.user +'>'
              });

              // USING TEMPLATE BASE SENDER FUNCTION TO SEND AN EMAIL
              sendReminder({
                to: email,
              },
              {
                username: username,
              },
              function(err, info){
                if (err){
                  console.log('auto_email.js: Error sending username reminder.');
                  return err;
                }
              });
          }
        });
    }
  });
}

// FORGOT PASSWORD EMAIL
function forgotpassword(email, username, token, next){

  fs.readFile('../gibsonwebsite/email_templates/forgot_password/text.txt', 'utf-8', function(err, data){
    if(err){
      console.log('auto_email.js: Cannot read text.txt for forgot password.');
      return err;
    }
    else{

        var plain = data;

        fs.readFile('../gibsonwebsite/email_templates/forgot_password/html.html', 'utf-8', function(err, data){
          if(err){
            console.log('auto_email.js: Cannot read html.html for forgot password.');
            return err;
          }
          else{
              var styled = data;

              // CREATE TEMPLATE BASE SENDER FUNCTION
              var sendForgotPassword = transport.templateSender({
                subject: 'Account Recovery',
                text: data,
                html: styled
              },
              {
                from: '105 Gibson Centre <' +config.transport.auth.user +'>'
              });

              // USING TEMPLATE BASE SENDER FUNCTION TO SEND AN EMAIL
              sendForgotPassword({
                to: email,
              },
              {
                username: username,
                domain: config.domains[0],
                token: token
              },
              function(err, info){
                if (err){
                  console.log('auto_email.js: Error sending forgot password email.');
                  return err;
                }
              });
          }
        });
    }
  });
}

module.exports.forgotpassword = forgotpassword;
module.exports.usernameReminder = usernameReminder;
module.exports.signupConfEmail = signupConfEmail;
module.exports.resendSignupEmail = resendSignupEmail;
