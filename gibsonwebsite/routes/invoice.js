var express = require('express');
var router = express.Router();
var config = require('../server_config');
var mysql = require('mysql');
var connection = require('../mysqlpool');
var async = require('async');
var readSQL = require('../public/js/readSQL');
var paypal = require('paypal-rest-sdk');

router.get('/invoice', function(req, res, next){

  // CONFIGURING PAYPAL
  paypal.configure(config.paypal_config);

  // GETTING DATABSE CONNECTION
  connection.getConnection(function(err, con){
    if (err){
			console.log("invoice.js: cannot get connection");
			res.send(400, 'Connection Failed');
			return err;
		}
    else{

      // BIG BOSS WANTS WATERFALL, SO GRAVITY ASSISTED FUNCTIONS:
      async.waterfall([

        function(next){
          var saleId = req.query.paymentId.substring(4);
          var payerId = req.query.PayerID;

          paypal.sale.get(saleId, function(err, saleDetail){
            if (err){
              console.log(err);
              return next({errno:500, msg:"Error getting sale detail from PayPal."}, null);
            }
            else{
              console.log(saleDetail);
              next(null, saleDetail);
            }
          });
        }
      ],
      // FINAL FUNCTION
      function(err, results){
        res.send(200);
      });
    }
  });
});

module.exports = router;
