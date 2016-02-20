var db_config = {
    host:'localhost',
    user:'root',
    password:'local123',
    database:'gibson',
    port:3306
};

var jwt_secret = {
  secret : 'g1b50n secret'
};

module.exports.db_config = db_config;
module.exports.jwt_secret = jwt_secret;
