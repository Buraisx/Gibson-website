/*
$("a[href$='#courses']").click(function() {
	$.ajax({
		datatype: "json",
		url: '/user/profile/courses',
		success: $.getJSON('/user/profile/courses', function(data){
			console.log(data);
		}), 
		error: function() {
			console.log("Error getting courses");
		},
		type: 'GET'
	});
});
*/

$("a[href$='#courses']").click(function() {

	jQuery.getJSON("/user/profile/courses", function(data){
		
		var $courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < data.length; i++){
			
			document.getElementById("coursename").innerHTML = "Course Name: " + data[0].course_name;
			document.getElementById("coursename").coursename = "Course Name: " + data[0].course_name;
			alert(document.getElementById("coursename").coursename);
			document.getElementById("courseid").innerHTML = "Course ID: "+ data[0].course_id;
			document.getElementById("courseid").courseid = "Course ID: "+ data[0].course_id;
			alert(document.getElementById("courseid").courseid);

			document.getElementById("description").innerHTML = "Description: " + data[0].course_description;
			document.getElementById("coursestartdate").innerHTML = "Start Date: "+ data[0].start_date;
			document.getElementById("courseenddate").innerHTML = "End Date: " + data[0].end_date;
			document.getElementById("coursetime").innerHTML = "Course Time: " + data[0].course_time;
			document.getElementById("courseinterval").innerHTML = "Course Interval: " + data[0].course_interval;
			document.getElementById("coursedays").innerHTML = "Course Days: " + data[0].course_days;
			document.getElementById("coursetarget").innerHTML = "Course target: " + data[0].course_target;
			document.getElementById("coursecost").innerHTML = "Course cost: " + data[0].default_fee;			

		}			
	});
});


