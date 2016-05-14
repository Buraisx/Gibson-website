var mysql = require("mysql");
var config = require("./server_config");

var connection = mysql.createPool(config.db_config);
var badConnection = mysql.createPool(config.db_badconfig);

exports.getConnection = function (callback){
  connection.getConnection(function(err, con){
    if (err){
      return callback(err);
    }
    callback(err, con);
  });
};

exports.getBadConnection = function (callback){
  badConnection.getConnection(function(err, con){
    if (err){
      return callback(err);
    }
    callback(err, con);
  });
};
