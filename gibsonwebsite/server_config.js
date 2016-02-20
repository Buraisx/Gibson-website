var db_config = {
    host:'localhost',
    user:'root',
    password:'321321408',
    database:'gibson',
    port:3306
};

var jwt_secret = {
  secret: 'g1b50n secret',
  issuer: 'https://www.105gibson.com'
};

module.exports.db_config = db_config;
module.exports.jwt_secret = jwt_secret;
