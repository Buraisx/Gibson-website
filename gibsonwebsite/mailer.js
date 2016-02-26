var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

//Gmail transporter
var transport = nodemailer.createTransport(smtpTransport({
    host : 'smtp.gmail.com',
    secure : true,
    port: 465,
    auth : {
        user : 'nansagad@gmail.com',
        pass : 'sagadatthis'
    }
}));

module.exports.transport = transport;
