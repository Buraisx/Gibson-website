var mysql = require('mysql');
var async = require('async');
var mysql = require('mysql');
var connection = require('../../mysqlpool');

/* Return days scheduled for course course_id between start_date and end_date
 Input: course_id  	course_id
		start_date 	start of date interval
		end_date 	end of date interval
		interval	how many days in between, e.g. weekly, bi-weekly
		days	  	the days of the week this course is held
 days be in array of jsons pls

*/
var DAILY = 1;
var WEEKLY = 7;
var BIWEEKLY = 14;

exports.getScheduledDays = function (course_id, start_date, end_date, interval, days) {
	connection.getConnection(function (err, con){
		if(err){
			return err;
		}
		//console.log(days);
		async.map(days, function(this_day, callback){
				var template = 'INSERT INTO gibson.course_days VALUES (?, ?, ?, ?, ?, ?, ?);';

				var start = new Date(start_date);
				var course_date = new Date(start_date);
				var end = new Date(end_date);
				//console.log(this_day);
				this_day = JSON.parse(this_day);

				course_date.setDate(start.getDate() + (parseDay(this_day.day) - start.getDay() + 7) % 7);

				(function loop_schedule(course_date, start, end, interval, this_day){
					if(course_date <= end){
						con.query(mysql.format(template, [course_id, course_date, parseTime(this_day.start_time), parseTime(this_day.end_time), 'SCHEDULED', 'SCHEDULED', 'Scheduled Course Time']), function(err, results){
							///console.log("INSERTED " + course_date);
						});

						setTimeout(function(){
							//var next_date = course_date.getDate() + getInterval(interval);
							course_date.setDate(course_date.getDate() + getInterval(interval));
							loop_schedule(course_date, start, end, interval, this_day);
						}, 0);
					}

					else{
						callback(null);
					}
				})(course_date, start, end, interval, this_day);
			},

			function(err){
				con.release();
				if(err){
					return err;
				}
				else{
					return null;
				}
		});
	});
};

exports.getAdhocDays = function (course_id, days){
	connection.getConnection(function(err, con){
		if(err){
			return err;
		}

		async.map(days, function (this_day, callback){
			var template = 'INSERT INTO gibson.course_days VALUES (?, ?, ?, ?, ?, ?, ?);';
			this_day = JSON.parse(this_day);

			template = mysql.format(template, [course_id, this_day.day, parseTime(this_day.start_time), parseTime(this_day.end_time), 'ADHOC', 'SCHEDULED', 'AD-HOC COURSE TIME']);

			con.query(template, function (err, results){
				//console.log("INSERTED AD-HOC " + this_day.day);
			});
			callback(null);
		},
		function(err){
			con.release();
			if (err) {
				return err;
			}
			else {
				return null;
			}
		});

	});
};

function parseTime(time){
	var values = time.match(/[0-9]+/g);
	var meridiem = time.match(/[PA][M]/g);

	if(meridiem[0] === 'PM'){
	    var toTwentyFour = Number(values[0]) + 12;
		values[0] = toTwentyFour.toString();
	}

	return (values[0] + ':' + values[1] + ':' + '00');
}

function getInterval(interval){
	switch (interval.toLowerCase()){
		case 'weekly':
			return WEEKLY;
		case 'bi-weekly':
			return BIWEEKLY;

	}
}

function parseDay (day) {
	switch(day.toLowerCase()){
	case "sunday":
        return 7;
    case "monday":
        return 1;
    case "tuesday":
        return 2;
    case "wednesday":
        return 3;
    case "thursday":
        return 4;
    case "friday":
		return 5;
    case "saturday":
        return 6;
	}
}
