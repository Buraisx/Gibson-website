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
	for (int i = 0; i < days.length(); i++){
		var day_of_week = parseDay(days[i].day);
		var course_day = start_date.setDate(start_date.getDate() + (day_of_week - start_date.getDay() + 7) % 7);
		var template = 'INSERT INTO gibson.course_days VALUES (?, ?, ?, ?, ?, ?, ?);';
		while(course_day < end_date){
			commit.push(mysql.format(template, [course_id, course_day, days[i].start_time, days[i].end_time, 'SCHEDULED', 'SCHEDULED', 'Scheduled Course Time']));
		// query ();
		}
		course_day += getInterval(interval);
	}
	return commit;
});
	
	
};

function getInterval(interval){
	if(interval === 'Weekly'){
		return WEEKLY;
	}
	
	else if(interval === 'Bi-weekly'){
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