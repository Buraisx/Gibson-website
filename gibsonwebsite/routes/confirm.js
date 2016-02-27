var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var router = express.Router();

router.get('/confirm', function(req, res) {


  jwt.verify(req.query.token, config.jwt.oneUseSecret, function(err, decoded){

    // TOKEN VERIFICATION FAILED
    if (err){
      console.log('confirm.js: Token verification failed.');
      res.redirect('/error');
    }

    // CREATES POOLING connection
    var connection = mysql.createPool(config.db_config);
    connection.getConnection(function(err, con){
      if(err){
        console.log('confirm.js: Error connecting to the database.');
        res.redirect('/error');
      }
      else{

        // BLACK LISTING ALL 'signup confirmation' TOKEN LINKED TO THE USER'S user_id
        var tokenQuery = 'SELECT * FROM gibson.active_tokens WHERE username = ? AND \`desc\` = ?';
        tokenQuery = mysql.format(tokenQuery, [decoded.user, decoded.type]);

        con.query(tokenQuery, function(err, results){
          if (err){
            console.log('confirm.js: Error querying for active tokens.');
            con.release();
            res.redirect('/error');
          }
          else{
            var blacklistQuery = '';

            for (var i = 0; i < results.length; i++){
              blacklistQuery += 'UPDATE gibson.active_tokens SET blacklisted = 1 WHERE token_id = ';
              blacklistQuery += results[i].token_id +'; ';
            }

            con.query(blacklistQuery, function(err, results){
              if (err){
                console.log('confirm.js: Error while blacklisting tokens');
                con.release();
                res.redirect('/error');
              }
              else{
                // TODO: MOVE USER FROM TEMPORARY USER TABLE TO PERMAMNENT

                con.release();
                res.redirect('/signupconfirm');
              }
            });
          }
        });
      }
    });
  });
});

router.get('signupconfirm', function(req, res){
  res.render('signupconfirm', {title: '105 Gibson - E-mail Address Confirmed'});
});

module.exports = router;
