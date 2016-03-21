
//List users on page ready
$("a[href$='#profile']").ready(function(){
	listusers();
});

//List users on Click
$("a[href$='#profile']").click(function(){
	listusers();
});

//List of Courses on click
$("a[href$='#courses']").click(function() {
	listcourses();
});

$("a[href$='#addcourses']").ready(function(){
	courseform();
});






//====================================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================
//LIST OF FUNCTIONS===================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================

/*
//========================================
//Send POST request on Register of Courses
//========================================
function addCourse(course_add){
	console.log("Clicked button " + $('#_csrf').val());
	$.post("/addCourse", {
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		console.log("You have added a course!");
		console.log(res);
		alert("You have successfully added a new course!");
	})
	.fail(function (err){
		console.log("This course already exists.");
		alert("This is an already existing course");
	});
}
*/

// Generate List of users HTML
function listusers(){
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
			var fullname = $("<p></p>", {id: "fullname" + i}).append(user_info[i].fname, " ", user_info[i].lname);
			var collapse2 = $("<div></div>", {id: "usercollapse" + i, class: "panel-collapse collapse"});
			var panelbody = $("<div></div>", {class: "panel-body"});


			//==================================
			//==================================
			//WRITE ALL BASIC TAGS
			//==================================
			//==================================
			///Header in Profile
			var basicInfo = $("<h3></h3>").append("Basic Information");

			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"col-sm-6"});

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
			var dob = $("<p></p>", {id: "dob" + i}).append($("<strong></strong>").append("Date of Birth: "), String(user_info[i].birth_date).substring(0, 10));

			//Address
			var address = $("<p></p>", {id: "address" + i}).append($("<strong></strong>").append("Address: "), (user_info[i].address));

			if (user_info[i].student == 1) {
				// Do student stuff
			}

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
	        //        <div class = "col-sm-6">
	        //            <p>First Name: </p>
	        //        </div>
	        //        <div class = "col-sm-6">
	        //            <p>Last Name: </p>
	        //        </div>
	        //        <div class = "col-sm-6">
	        //            <p>Relationship: </p>
	        //       </div>
	        //        <div class = "col-sm-6">
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
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		fname),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		lname)));			//escaping closures

			// Username & email
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		username),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		email)));			//escaping closures

			// Phone numbers
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		primaryPhone),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		secondaryPhone)));			//escaping closures
			
			// Birth info
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		gender),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		dob)));			//escaping closures

			// Address
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
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
}

//Generates List of Courses HTML
function listcourses(){
	jQuery.getJSON("/admin/profile/courses", function(data){
		
		$('#courses').contents().remove();
		
		var courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < data.length; i++){
			//A Course Accordion Panel
			var panel_default = $("<div></div>", {class: "panel panel-primary"});
			
			var panel_heading = $("<div></div>", {class: "panel-heading"});
			var panel_title = $("<h4></h4>", {class: "panel-title"});
			var collapse = $("<a></a>", {href: "#collapse"+i});
			collapse.attr("data-toggle", "collapse");
			var coursename = $("<p></p>", {id: "coursename"}).append(data[i].course_name);
			var courseid = $("<p></p>", {id: "courseid"}).append("Course ID:", data[i].course_id);

			var collapse2 = $("<div></div>", {id: "collapse" + i, class: "panel-collapse collapse"});
			var panelbody = $("<div></div>", {class: "panel-body"});

			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"col-sm-6"});
			var description = $("<p></p>", {id: "description"}).append("<strong>Description: </strong>").append(data[i].course_description);
			var startdate = $("<p></p>", {id: "coursestartdate"}).append("<strong>Start Date: </strong>" + String(data[i].start_date).substring(0, 10));
			var enddate = $("<p></p>", {id: "courseenddate"}).append("<strong>End Date: </strong>" + String(data[i].end_date).substring(0, 10));
			var coursetime = $("<p></p>", {id: "coursetime"}).append("<strong>Time: </strong>" + data[i].course_time);
			var courseinterval = $("<p></p>", {id: "courseinterval"}).append("<strong>Interval: </strong>" + data[i].course_interval);
			var coursedays = $("<p></p>", {id: "coursedays"}).append("<strong>Days: </strong>" + data[i].course_days);
			var coursetarget = $("<p></p>", {id: "coursetarget"}).append("<strong>Target: </strong>" + data[i].course_target);
			var coursecost = $("<p></p>", {id: "cost"}).append("<strong>Cost: </strong>$" + data[i].default_fee);


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
										 	$("<div></div>", {class:"col-sm-12"}).append(
										 		description)));		//escaping closures	

			panelbody = panelbody.append("<br>");

			//STARTDATE & ENDDATE
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		startdate),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		enddate)));			//escaping closures

			//COURSE TIME & COURSE INTERVAL
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		coursetime),			//escaping closures
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		courseinterval)));			//escaping closures

			panelbody = panelbody.append("<br>");

			//COURSE COST
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"col-sm-6"}).append(
										 		coursecost)));			//escaping closures

			
			courses.append(panel_default);
		}

		$('#courses').append(courses);
	});
}


function courseform(){
	var nav = '';
	nav += '<h1>Add A Course</h1>'
	nav += '</br>'
	nav += '<ul class="nav nav-tabs">';
	nav += '	<li class="active"><a href="#info-tab" data-toggle="tab">Course Information <i class="fa"></i></a></li>';
	nav += '	<li><a href="#instructor-tab" data-toggle="tab">Instructor Information <i class="fa"></i></a></li>';
	nav += '	<li><a href="#time-tab" data-toggle="tab">Set Course Days <i class="fa"></i></a></li>';
	nav += '</ul>';

	var csrfmeta = $("meta[name=_csrf]");
	var addcourses='';
	addcourses+='                <form name="frm" action = "/admin/profile/addCourse" method = "POST" role = "form" id="courseform">';
	addcourses+='                     <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';
	addcourses+='						<div class="tab-content">';
	addcourses+='						<br>';

	//Course Info Tab
	var course_info='';
	course_info+='					<div class="tab-pane active" id="info-tab">';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label><span class="required">*</span>Course Name:</label>';
	course_info+='                            <input type = "text" class = "form-control" name = "addcoursename" id = "addcoursename" required>';
	course_info+='                        </div>';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label><span class="required">*</span>Course Code:</label>';
	course_info+='                            <input type = "text" class = "form-control" name = "addcoursecode" id = "addcoursecode" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label><span class="required">*</span>Cost:</label>';
	course_info+='                            <input type = "number" class = "form-control" name = "addcost" id = "addcost" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label>Maxmimum Capacity:</label>';
	course_info+='                            <input type = "number" class = "form-control" name = "course_limit" id = "course_limit" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row" id="language1">';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label><span class="required">*</span>Language:</label>';
	course_info+='                            <input type = "text" class = "form-control" name = "course_language1" id = "course_language1" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row" id="languageMods">';
	course_info+='                        <div class = "form-group col-sm-2">';
	course_info+='                            <button type = "button" class= "btn btn-default" id = "addlanguage" onClick="addLanguages()">Add Another Language</button>';
	course_info+='                        </div>';
	course_info+='                        <div class = "form-group col-sm-2">';
	course_info+='                            <button type = "button" class= "btn btn-default" id = "addlanguage" onClick="removeLanguages()">Remove Language</button>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-8">';
	course_info+='                            <label><span class="required">*</span>Description:</label>';
	course_info+='                            <textarea class = "form-control" rows = "6" name = "adddescription" id = "adddescription"></textarea>';
	course_info+='                        </div>';
	course_info+='                  	</div>';
	course_info+='					</div>';

	//Instructor Info Tab
	var instructor_info = '';
	instructor_info+='				<div class="tab-pane" id="instructor-tab">';
	instructor_info+='					 <div class = "row">';
	instructor_info+='					 	 <div class = "form-group col-sm-4">';
	instructor_info+='					 		 <label><span class="required">*</span>Instructor\'s Name:</label>';
	instructor_info+='                            <input type = "text" class = "form-control" name = "instructor_name" id = "instructor_name" required>';
	instructor_info+='					 	 </div>';
	instructor_info+='					 	 <div class = "form-group col-sm-4">';
	instructor_info+='					 		 <label>Instructor\'s Username:</label>';
	instructor_info+='                            <input type = "text" class = "form-control" name = "instructor_username" id = "instructor_username" required>';
	instructor_info+='					 	 </div>';
	instructor_info+='					 </div>';
	instructor_info+='                    <div class = "row">';
	instructor_info+='                        <div class = "form-group col-sm-8">';
	instructor_info+='                            <label><span class="required">*</span>Instructor Biography:</label>';
	instructor_info+='                            <textarea class = "form-control" rows = "6" name = "instructor_bio" id = "instructor_bio"></textarea>';
	instructor_info+='                        </div>';
	instructor_info+='                    </div>';
	instructor_info+='              </div>';

	//Set Course Days Tab
	var set_date = '';
	set_date+='               <div class="tab-pane" id="time-tab">';
	set_date+='                    <div class = "row">';
	set_date+='                    <div class = "form-group col-sm-8">';
	set_date+='                        <label><span class="required">*</span>Date :</label><br>';
	set_date+='                        <div class="input-daterange input-group" id="rangedatepicker">';
	set_date+='                            <input type="text" class="input-sm form-control" name="addstartdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	set_date+='                            <span class="input-group-addon">to</span>';
	set_date+='                            <input type="text" class="input-sm form-control" name="addenddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                    </div>';
	set_date+='                    <div class = "row">';
	set_date+='                        <div class = "form-group col-sm-4">';
	set_date+='                            <label><span class="required">*</span>Time:</label>';
	set_date+='                            <input type = "text" class = "form-control" name = "addtime" id = "addtime" required>';
	set_date+='                        </div>';
	set_date+='                        <div class = "form-group col-sm-4" required>';
	set_date+='                            <label><span class="required">*</span>Interval:</label><br>';
	set_date+='                            <label class="radio-inline">';
	set_date+='                              <input type="radio" name="addinterval" value="weekly">Weekly';
	set_date+='                            </label>';
	set_date+='                            <label class="radio-inline">';
	set_date+='                              <input type="radio" name="addinterval" value="bi-weekly">Bi-weekly';
	set_date+='                            </label>';
	set_date+='                            <label class="radio-inline">';
	set_date+='                              <input type="radio" name="addinterval"  value="daily">Daily';
	set_date+='                            </label>';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                    <div class = "row">';
	set_date+='                        <div class = "form-group col-sm-4">';
	set_date+='                            <label><span class="required">*</span>Target:</label>';
	set_date+='                            <input type = "text" class = "form-control" name = "addtarget" id = "addtarget" required>';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                    <div class = "row">';
	set_date+='                        <div class = "form-group col-sm-8">';
	set_date+='                            <label><span class="required">*</span>Days:</label><br>';
	set_date+='                        ';
	set_date+='                            <label class="checkbox-inline">';
	set_date+='                              <input type="checkbox" name= "adddays" value="monday">Monday';
	set_date+='                            </label>';
	set_date+='                            <label class="checkbox-inline">';
	set_date+='                              <input type="checkbox" name= "adddays" value="tuesday">Tuesday';
	set_date+='                            </label>';
	set_date+='                            <label class="checkbox-inline">';
	set_date+='                              <input type="checkbox" name= "adddays" value="wednesday">Wednesday';
	set_date+='                            </label>';
	set_date+='                            <label class="checkbox-inline">';
	set_date+='                              <input type="checkbox" name= "adddays" value="thursday">Thursday';
	set_date+='                            </label>';
	set_date+='                            <label class="checkbox-inline">';
	set_date+='                              <input type="checkbox" name= "adddays" value="friday">Friday';
	set_date+='                            </label>';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                </div>';

	//Insert all tabs
	addcourses+=course_info;
	addcourses+=instructor_info;
	addcourses+=set_date;

	//Submit Tab
	addcourses+='				  	 </div>';	//closing tab div
	addcourses+='                    <div class="row form-group">';
	addcourses+='                        <div class = "col-sm-8">';
	addcourses+='                            <button type = "submit" class= "btn btn-default" id = "addcourse">Add Course</button>';
	addcourses+='                        </div>';
	addcourses+='                    </div>';
	addcourses+='                </form>';

	$('#addcourses').append(nav);
	$('#addcourses').append(addcourses);
	$('#rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
}

//reset onpage refresh
var COUNTLANGUAGE=1;

function addLanguages(){
	console.log("Adding " + COUNTLANGUAGE + " languages.");

	var newLanguage=COUNTLANGUAGE+1;

	var language='';
	language+='                    <div class = "row" id="language' + newLanguage +'" style="display:none;">';
	language+='                        <div class = "form-group col-sm-4">';
	language+='                            <label>Language:</label>';
	language+='                            <input type = "text" class = "form-control" name = "course_language' + newLanguage + '" id = "course_language' + newLanguage + '" required>';
	language+='                        </div>';
	language+='                    </div>';

	$('#language'+COUNTLANGUAGE).after(language);
	$('#language'+newLanguage).slideToggle();
	COUNTLANGUAGE++;
}

function removeLanguages(){
	if(COUNTLANGUAGE > 1){
		console.log("Removing " + COUNTLANGUAGE + " languages.");
		$('#language'+COUNTLANGUAGE).slideToggle(function(){
			$('#language'+COUNTLANGUAGE).remove();
			COUNTLANGUAGE--;
		});
	}

	else{
		console.log("Cannot Remove Default Language");
	}

}