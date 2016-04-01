var mysql = require('mysql');

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
	
	var commit = [];

	start_date = new Date(start_date);
	end_date = new Date(end_date);
	console.log(start_date.getDate());
	var a = start_date.getDate() + (1 - start_date.getDay() + 7) % 7;
	console.log('HERE WE GO' + a);

	for (var i = 0; i < days.length; i++){
		var course_day;
		var this_day=JSON.parse(days[i]);
		console.log(this_day);
		var day_of_week = parseDay(this_day.day);
		course_day.setDate(start_date.getDate() + (day_of_week - start_date.getDay() + 7) % 7);
		console.log("HERE WE GO" + course_day);

		var template = 'INSERT INTO gibson.course_days VALUES (?, ?, ?, ?, ?, ?, ?);';
		while(course_day < end_date){
			console.log(mysql.format(template, [course_id, course_day, this_day.start_time, this_day.end_time, 'SCHEDULED', 'SCHEDULED', 'Scheduled Course Time']));
			commit.push(mysql.format(template, [course_id, course_day, this_day.start_time, this_day.end_time, 'SCHEDULED', 'SCHEDULED', 'Scheduled Course Time']));
			course_day.setDate(course_day.getDate()+getInterval(interval));
		// query ();
		}
	}
	return commit;
};
	

function getInterval(interval){
	switch (interval){
		case 'Weekly':
			return WEEKLY;
		case 'Bi-weekly':
			return BIWEEKLY;

	}
}

function parseDay (day) {
	switch(day.toLowerCase()){
	case "sunday":
        return 6;
    case "monday":
        return 0;
    case "tuesday":
        return 1;
    case "wednesday":
        return 2;
    case "thursday":
        return 3;
    case "friday":
		return 4;
    case "saturday":
        return 5;
	}
}