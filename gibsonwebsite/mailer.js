var nodemailer = require('nodemailer');


//Normal mail transporter
var transport = nodemailer.createTransport(smtpTransport({
  host: 'smtp.yourprovider.org',
  port: 25,
  auth: {
    user: 'username',
    pass: 'password'
  }
}));

//Gmail transporter
var gTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nansagad@gmail.com',
   	pass: 'sagadatthis'
  }
});

module.exports.transport = transport;
module.exports.gTransport = gTransport;
