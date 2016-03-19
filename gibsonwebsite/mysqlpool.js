var mysql = require("mysql");
var config = require("server_config");

var connection = mysql.createPool(config.db_config);

exports.getConnection = function (cb){
  connection.getConnection(function(err, con){
    if (err){
      return cb(err);
    }
    cb(err, con);
  });
};
