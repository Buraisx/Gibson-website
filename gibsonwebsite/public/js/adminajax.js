
//Get cookie Values
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// Runs automatically on document load
$(function listusers(){
	jQuery.getJSON("/admin/profile/info", function(user_info){
		$('#profile').contents().remove();

		var users = $("<div></div>", {class: "panel-group", id: "profileaccordion"});

		for(var i = 0; i < user_info.length; i++) {
			//A user Accordion Panel
			var panel_default = $("<div></div>", {class: "panel panel-primary"});
			
			var panel_heading = $("<div></div>", {class: "panel-heading"});
			var panel_title = $("<h4></h4>", {class: "panel-title"});
			var collapse = $("<a></a>", {href: "#usercollapse"+i});
			collapse.attr("data-toggle", "collapse");
			collapse.attr("data-parent", "#profileaccordion");
			var fullname = $("<p></p>", {id: "fullname" + i}).append(user_info[i].fname, " ", user_info[i].lname);
			var collapse2 = $("<div></div>", {id: "usercollapse" + i, class: "panel-collapse collapse in"});
			var panelbody = $("<div></div>", {class: "panel-body"});


			//==================================
			//==================================
			//WRITE ALL BASIC TAGS
			//==================================
			//==================================
			///Header in Profile
			var basicInfo = $("<h3></h3>").append("Basic Information");

			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"form-group col-sm-6"});

			//Name
			var fname = $("<p></p>", {id: "fname" + i}).append($("<strong></strong>").append("First Name: "), (user_info[i].fname));
			var lname = $("<p></p>", {id: "lname" + i}).append($("<strong></strong>").append("Last Name: "), (user_info[i].lname));

			//Identifiers
			var username = $("<p></p>", {id: "username" + i}).append($("<strong></strong>").append("Username: "), (user_info[i].username));
			var email = $("<p></p>", {id: "email" + i}).append($("<strong></strong>").append("Email: "), (user_info[i].email));

			//Phone
			var primaryPhone = $("<p></p>", {id: "primaryphone" + i}).append($("<strong></strong>").append("Phone (Home): "), (user_info[i].primary_phone));
			var secondaryPhone = $("<p></p>", {id: "secondaryphone" + i}).append($("<strong></strong>").append("Phone (Cell): "), (user_info[i].secondary_phone));

			//Birth Info
			var gender = $("<p></p>", {id: "gender" + i}).append($("<strong></strong>").append("Gender: "), (user_info[i].gender));
			var dob = $("<p></p>", {id: "dob" + i}).append($("<strong></strong>").append("Date of Birth: "), (user_info[i].birth_date));

			//Address
			var address = $("<p></p>", {id: "" + i}).append($("<strong></strong>").append("Address: "), (user_info[i].address));


			/*
				//Student Info
				var student = $("<h3></h3>").append("Student Information");
				//School Name and Grade
				var schoolname = $("<div></div>", {class: "col-sm-6"}).append("<p>School Name: " + user_info.user.address + " </p>");
				var grade = $("<div></div>", {class: "col-sm-6"}).append("<p>Grade: " + user_info.user.address + " </p>");
				//Major and ESL
				var major = $("<div></div>", {class: "col-sm-6"}).append("<p>Major: " + user_info.user.address + " </p>");
				var esl = $("<div></div>", {class: "col-sm-6"}).append("<p>ESL Level: " + user_info.user.address + " </p>");
			*/


			//Emergency Contacts Header
			//var emInfo = $("<h3></h3>").append("Emergency Contacts");

			//===================================
			//Place holder for Emergency Contacts
			//===================================
			//var eContacts = $("<p></p>").append("[*Insert EJS code here]");
			//unnecessary html code
			//<h4>Contact x</h4>
	        //    <div class = "row">
	        //        <div class = "form-group col-sm-6">
	        //            <p>First Name: </p>
	        //        </div>
	        //        <div class = "form-group col-sm-6">
	        //            <p>Last Name: </p>
	        //        </div>
	        //        <div class = "form-group col-sm-6">
	        //            <p>Relationship: </p>
	        //       </div>
	        //        <div class = "form-group col-sm-6">
	        //            <p>Phone: </p>
	        //        </div>
	        //    </div>
			
			//==================================


			//=============================
			//Top Down compilation hierarchy
			//=============================
			panel_default = panel_default.append(panel_heading, collapse2);

			//--------------------------
			//First div of panel-default
			panel_heading = panel_heading.append(panel_title);
			panel_title = panel_title.append(collapse);
			collapse = collapse.append(fullname);

			//--------------------------
			//Second div of panel-default
			collapse2 = collapse2.append(panelbody);

			// Header
			panelbody = panelbody.append(basicInfo);

			// First & last name
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		fname),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		lname)));			//escaping closures

			// Username & email
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		username),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		email)));			//escaping closures

			// Phone numbers
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		primaryPhone),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		secondaryPhone)));			//escaping closures
			
			// Birth info
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		gender),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		dob)));			//escaping closures

			// Address
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		address)));			//escaping closures

			// Emergency contacts header
			//panelbody = panelbody.append(emInfo);


			users.append(panel_default);


		/*
				//==================
				//TOP DOWN HIERARCHY
				//==================
				$('#profile').append(basicInfo);
				//fname lname
				$('#profile').append($("<div></div>", {class:"row"}).append(
					fname, lname));
				//username email
				$('#profile').append($("<div></div>", {class:"row"}).append(
					username, email));
				//Phone (Home, Cell)
				$('#profile').append($("<div></div>", {class:"row"}).append(
					primaryPhone, secondaryPhone));
				//Gender and Date of Birth
				$('#profile').append($("<div></div>", {class:"row"}).append(
					gender, dob));
				//Address
				$('#profile').append($("<div></div>", {class:"row"}).append(
					address));
				/*
				//check if user is a student
				if(user_info.user.student==1)
				{
					//Student Info
					$('#profile').append(student);
					//School Name and grade
					$('#profile').append($("<div></div>", {class:"row"}).append(
						schoolname, grade));
					//major and esl level
					$('#profile').append($("<div></div>", {class:"row"}).append(
						major, esl));
				}[*]/
				//Emergency Contact
				$('#profile').append(emInfo);
				$('#profile').append(eContacts);

				*/
		}
		$('#profile').append(users);
	});
});

$("a[href$='#profile']").click(function(){
	listusers();
});


$("a[href$='#courses']").click(function() {
	jQuery.getJSON("/user/profile/courses", function(data){
		
		$('#courses').contents().remove();
		
		var courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < data.length; i++){
			//A Course Accordion Panel
			var panel_default = $("<div></div>", {class: "panel panel-primary"});
			
			var panel_heading = $("<div></div>", {class: "panel-heading"});
			var panel_title = $("<h4></h4>", {class: "panel-title"});
			var collapse = $("<a></a>", {href: "#collapse"+i});
			collapse.attr("data-toggle", "collapse");
			collapse.attr("data-parent", "#accordion");
			var coursename = $("<p></p>", {id: "coursename"}).append(data[i].course_name);
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


			//=============================
			//Top Down compilation hierarchy
			//=============================
			panel_default = panel_default.append(panel_heading, collapse2);

			//--------------------------
			//First div of panel-default
			panel_heading = panel_heading.append(panel_title);
			panel_title = panel_title.append(collapse);
			collapse = collapse.append(coursename, courseid);

			//--------------------------
			//Second div of panel-default
			collapse2 = collapse2.append(panelbody);

			//DESCRIPTION
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		description)));		//escaping closures	

			panelbody = panelbody.append("<br>");

			//STARTDATE & ENDDATE
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		startdate),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		enddate)));			//escaping closures

			//COURSE TIME & COURSE INTERVAL
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		coursetime),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		courseinterval)));			//escaping closures

			panelbody = panelbody.append("<br>");

			//COURSE COST & BUTTON
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		coursecost)));			//escaping closures

			
			courses.append(panel_default);
		}

		$('#courses').append(courses);
	});
});

//Add courses
$("a[href$='#addcourses']").click(function() {
	jQuery.getJSON("", function(data){//need to add a route
		
		$('#addcourses').contents().remove();

		//==================================
		///Header in Add Course
		var addcourse = $("<h1></h1>").append("Add Courses");

		var formInline = $("<form></form>", {class:"form-inline", role : "form"});

		//mix in one div form-group
		var coursename = $("<label></label>", {class:"required"}).append("Course Name:");
		var inputname = $("<input></input>", {type:"text", class:"form-control", name:"addcoursename", id:"addcoursename", required:""});

		//mix in one div form-group
		var courseid = $("<label></label>", {class:"required"}).append("Course ID:");
		var inputid = $("<input></input>", {type:"text", class:"form-control", name:"addcourseid", id:"addcourseid", required:""});

		//mix in one div form-group
		var startdate = $("<label></label>", {class:"required"}).append("Start Date:");
		var inputstart = $("<input></input>", {type:"text", class:"form-control", name:"addstartdate", id:"addstartdate", required:""});

		//mix in one div form-group
		var enddate = $("<label></label>", {class:"required"}).append("End Date:");
		var inputend = $("<input></input>", {type:"text", class:"form-control", name:"addenddate", id:"addenddate", required:""});

		//mix in one div form-group
		var addtime = $("<label></label>", {class:"required"}).append("Time:");
		var inputtime = $("<input></input>", {type:"text", class:"form-control", name:"addtime", id:"addtime", required:""});

		//mix in one div form-group
		var interval = $("<label></label>", {class:"required"}).append("End Date:");
		var inputinterval = $("<input></input>", {type:"text", class:"form-control", name:"addinterval", id:"addinterval", required:""});

		//mix in one div form-group
		var cost = $("<label></label>", {class:"required"}).append("Cost:");
		var inputcost = $("<input></input>", {type:"text", class:"form-control", name:"addcost", id:"addcost", required:""});

		//sumbit course button
		var button = $("<button></button>", {type : "submit", class : "btn btn-default", id : "submit"}).append("Add Course");
		
		var row = $("<div></div>", {class:"row"});
		//==============
		

		//==================
		//TOP DOWN HIERARCHY
		//==================
		$('#profile').append(addcourse);

		$('#profile').append(row);
		//course name and id
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(coursename, inputname));
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(courseid, inputid));
		
		$('#profile').append(row);
		//Start and end date
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(startdate, inputstart));
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(enddate, inputend));
		
		$('#profile').append(row);
		//time and interval
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(addtime, inputtime));
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(interval, inputinterval));
		
		$('#profile').append(row);
		//cost
		formInline.append($("<div></div>", {class:"form-group col-sm-4"}).append(cost, inputcost));

		//submit button
		formInline.append($("<div></div>", {class:"row form-group"}).append(button));
	});
});