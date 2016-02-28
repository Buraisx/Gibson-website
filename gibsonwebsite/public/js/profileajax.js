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
	console.log("asdf");
	jQuery.getJSON("/user/profile/courses", function(data){
		console.log("THis is a cedar tree. You know it's a cedar tree because that's the way it is");
		var courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < 4; i++){
			alert("jquery");
			/*
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
			*/
			var panel_default = $("<div></div>", {class: "panel panel-default"});
			var panel_heading = $("<div></div>", {class: "panel-heading"});
			var panel_title = $("<h4></h4>", {class: "panel-title"});
			var collapse = $("<a></a>", {href: "#collapse"+i});
			collapse.attr("data-toggle", "collapse");
			collapse.attr("data-parent", "#accordion");
			var coursename = $("<p></p>", {id: "coursename"}).append("Course Name:", data[i].course_name);
			var courseid = $("<p></p>", {id: "courseid"}).append("Course ID:", data[i].course_id);
			var collapse2 = $("<div></div>", {id: "collapse" + i, class: "panel-collapse collapse in"});
			var panelbody = $("<div></div>", {class: "panel-body"});
			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"form-group col-sm-6"});
			var description = $("<p></p>", {id: "description"}).append("Description: ").append(data[i].course_description);
			var startdate = $("<p></p>", {id: "coursestartdate"}).append("Start Date: " + data[i].start_date);
			var enddate = $("<p></p>", {id: "courseenddate"}).append("End Date: " + data[0].end_date);
			var coursetime = $("<p></p>", {id: "coursetime"}).append("Time: " + data[0].course_time);
			var courseinterval = $("<p></p>", {id: "courseinterval"}).append("Interval: " + data[0].course_interval);
			var coursedays = $("<p></p>", {id: "coursedays"}).append("Days: " + data[0].course_days);
			var coursetarget = $("<p></p>", {id: "coursetarget"}).append("Target: " + data[0].course_target);
			var coursecost = $("<p></p>", {id: "cost"}).append("Cost: $" + data[0].default_fee);
			var button = $("<button></button>", {type: "submit", class: "btn btn-default", onclick: "", id:"submit"}).append("Register Now!!");

			//compile the panel
			collapse = collapse.append(coursename, courseid);
			panel_title = panel_title.append(collapse);
			panel_heading = panel_heading.append(panel_title);
			//TODO
			// prepend colsm6 to all info
			description = colsm6.append(description);
			startdate = colsm6.append(startdate);
			enddate = colsm6.append(enddate);
			coursetime = colsm6.append(coursetime);
			courseinterval = colsm6.append(courseinterval);
			coursedays = colsm6.append(coursedays);
			coursetarget = colsm6.append(coursetarget);
			coursecost = colsm6.append(coursecost);
			button = colsm6.append(button);

			//TODO organize info into row-groups

			//TODO put into panel_body

			//TODO put panel_heading and panel_body together

			row = row.append(colsm6);
			panelbody = panelbody.append(row, "<br>");

			
			//collapse2 = collapse2.append(panelbody);

			panel_default = panel_default.append(panel_heading);



			$('#4am').after(coursename, courseid, startdate, enddate, button);
		}

	});
});


