var express = require('express');
var config = require('../server_config');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var router = express.Router();
var connection = require('../mysqlpool');
var pagename = 'profile.js';

function get_user_data () {
	var deco = jwt.decode(req.cookies.access_token);
	console.log(deco.user_id + " " + deco.rank);
	
	var query_hash = "SELECT hashedpassword, secret_key FROM gibson.user, gibson.rank WHERE deco.user_id = ?? AND deco.rank = ??";
	var inserts = [deco.user_id, deco.rank];
	query_hash = mysql.format(query_hash, inserts);
	var pwAndKey = '';
	var profile_info = [];
								  
	connection.getConnection(function(err, con){
		if (err)
		{
			con.release();
			console.log(pagename + ': Error connecting to database for query!');
			return done(err);
		}
		
		con.query(query_hash, function(err, results){
			if (err)
			{
				con.release();
				console.log(pagename + ": Error querying for user verification!");
				return done(err);
			}
			if (!results.length) {
				console.log(pagename: ': No user found with id' + inserts[0]);
				return done(new Error('YOU IMPOSTER MONGREL')); // return done(null, false, 'User not found');
			}
			//TODO make sure it actually concats, and anything else for this func?
			pwAndKey = results[0].hashedpassword + results[0].rank;
			return done(null, results[0]);
		});
	});

	jwt.verify(req.cookies.access_token, pwAndKey, 
	function(err, decoded) {
		var query_info = "SELECT * FROM gibson.user WHERE ?? = gibson.user.user_id";
		var insert_id = decoded.user_id;
		query_info = mysql.format(query_info, insert_id);
			
		connection.getConnection(function(err, con){
			if (err)
			{
				con.release();
				console.log(pagename + ': Error connecting to database for query!');
				return done(err);
			}
		
			con.query(query_info, function(err, results){
				if (err)
				{
					con.release();
					console.log(pagename + ": Error querying for user verification!");
					return done(err);
				}
				if (!results.length) {
					console.log(pagename: ': No user info found' + inserts[0]);
					return done(new Error('How can there be no user info')); // return done(null, false, 'User not found');
				}
				//TODO send to front end
				profile_info = [];
				return done(null, results[0]);
			});
		});

		
	});
}
*/