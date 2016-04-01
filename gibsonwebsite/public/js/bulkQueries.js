var mysql = require('mysql');
var async = require('async');

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

	//Get Full list of Scheduled Day
	var commit = scheduleSetup(course_id, start_date, end_date, interval, days);

	return commit;
};
	

function scheduleSetup(course_id, start_date, end_date, interval, days){

	async.map(days, function(this_day, callback){
				var template = 'INSERT INTO gibson.course_days VALUES (?, ?, ?, ?, ?, ?, ?);';
				var commit = [];

				var start = new Date(start_date);
				var course_date = new Date(start_date);
				var end = new Date(end_date);
				this_day = JSON.parse(this_day);

				course_date.setDate(start.getDate() + (parseDay(this_day.day) - start.getDay() + 7) % 7);

				(function loop_schedule(course_date, start, end, interval, this_day){
					if(course_date <= end){
						commit.push(mysql.format(template, [course_id, course_date, this_day.start_time, this_day.end_time, 'SCHEDULED', 'SCHEDULED', 'Scheduled Course Time']));
						setTimeout(function(){
							//var next_date = course_date.getDate() + getInterval(interval);
							course_date.setDate(course_date.getDate() + getInterval(interval));
							loop_schedule(course_date, start, end, interval, this_day);
						}, 0);
					}

					else{
						callback(null, commit);
					}
				})(course_date, start, end, interval, this_day);
			},

			function(err, results){
				console.log(results);
				return results;
		});
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