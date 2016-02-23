var db_config = {
    host:'localhost',
    user:'root',
    password:'Sabad@th!s1234567',
    database:'gibson',
    port:3306
};

var jwt = {
  secret: 'g1b50n secret',
  issuer: 'https://www.105gibson.com'
};

module.exports.db_config = db_config;
module.exports.jwt = jwt;
