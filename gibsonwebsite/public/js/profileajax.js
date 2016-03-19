
//On ready load profile info
$("a[href$='#profile']").ready(function(){
	load_profile();
});

//On Click profile tab load profile info
$("a[href$='#profile']").click(function(){
	load_profile();
});

//On Click course tab load a list of viewable courses
$("a[href$='#courses']").click(function() {
	listcourses();
});

//On Click schedule tab load personal schedule
$("a[href$='#schedule']").click(function() {
	listschedule();
});

//====================================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================
//LIST OF FUNCTIONS===================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================
//====================================================================================================================================================

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

//Get cookie Values
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

//========================================
//Send POST request on Register of Courses
//========================================
function register(course_register){
	console.log("Clicked button " + $('#_csrf').val());
	$.post("/register", {
			course_id: course_register.id.substring(6),
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		console.log("You're registered yay");
		console.log(res);
		alert("You have successfully signed up!");
	})
	.fail(function (err){
		console.log("Already registered course.");
		alert("You have already registered for this course!");
	});
}

//FUNCTION TO LOAD HTML OF USER PROFILE
function load_profile(){
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#profile').contents().remove();

		//==================================
		//==================================
		//WRITE ALL BASIC TAGS
		//==================================
		//==================================
		///Header in Profile
		var basicInfo = $("<h3></h3>").append("Basic Information");

		//Name
		var fname = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>First Name: </strong>" + user_info.user.fname + "</p>");
		var lname = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Last Name: </strong>" + user_info.user.lname + "</p>");

		//Identifiers
		var username = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Username: </strong>" + user_info.user.username + "</p>");
		var email = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Email: </strong>" + user_info.user.email + "</p>");

		//Birth Info
		var dob = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Date of Birth: </strong>" + String(user_info.user.birth_date).substring(0, 10) + "</p>"); // WIP

		//Emergency Contacts Header
		var emInfo = $("<h3></h3>").append("Emergency Contacts");

		//Add Emergency Contacts
		var newcontact = $("<h4></h4>").append("New Contact");
		var efnameinput = $("<div></div>", {class: "form-group col-sm-6"}).append($("<label></label>").append($("<span></span>", {class: "required"}).append(
			"*")).append("First Name:")).append($("<input></input>", {type: "text", class: "form-control", name: "efname", id: "efname", placeholder: "e.g. Alice", pattern: 
		"[a-zA-Z0-9. ]+", oninvalid: "setCustomValidity('Invalid name.')", onchange: "try{setCustomValidity('')}catch(e){}"}));
		var elnameinput = $("<div></div>", {class: "form-group col-sm-6"}).append($("<label></label>").append($("<span></span>", {class: "required"}).append(
			"*")).append("Last Name:")).append($("<input></input>", {type: "text", class: "form-control", name: "elname", id: "elname", placeholder: "e.g. Smith", pattern: 
		"[a-zA-Z0-9. ]+", oninvalid: "setCustomValidity('Invalid name.')", onchange: "try{setCustomValidity('')}catch(e){}"}));
		var erelationshipinput = $("<div></div>", {class: "form-group col-sm-6"}).append($("<label></label>").append($("<span></span>", {class: "required"}).append(
			"*")).append("Relationship:")).append($("<input></input>", {type: "text", class: "form-control", pattern: "[a-zA-Z0-9. ]+", name: "erelationship"}));
		var ephoneinput = $("<div></div>", {class: "form-group col-sm-6"}).append($("<label></label>").append($("<span></span>", {class: "required"}).append(
			"*")).append("Phone:")).append($("<input></input>", {type: "text", class: "form-control", maxlength: "16", pattern: "\w+", oninvalid: 
		"setCustomValidity('Invalid phone number.')", onchange: "try{setCustomValidity('')}catch(e){}" }));
		// Hidden emergency contact input
		var einputrow1 = $("<div></div>", {class:"row"}).append(efnameinput, elnameinput);
		var einputrow2 = $("<div></div>", {class:"row"}).append(erelationshipinput, ephoneinput);
		// Add button
		var addContacts = $("<div></div>", {class:"row form-group col-sm-12"}).append($("<button></button>", {class:"btn btn-default", onclick: "toggleaddecontact()", id: "econtactbutton"}).append("Add Emergency Contact"));


		//Edit Info
		var editInfo = $("<div></div>", {class:"row form-group col-sm-12"}).append(
			$("<button></button>", {type: "button", class: "btn btn-default", onclick: "editinfo()", id : "editinfo"}).append(
				"Edit Information"));

		//===============
		//Change Password 
		var changePassword = $("<div></div>", {class:"row form-group form-group-sm col-sm-12"}).append(
			$("<button></button>", {type : "button", class: "btn btn-default", onclick:"togglepassworddropdown()", id : "changepassbutton"}).append(
				"Change Password"));

		//Only client Can change Pass
		var cpHidden = $("<div></div>", {id:'change_password', class:'hidden changepassdesign form-group form-group-sm row col-sm-12'});
		var pText = $("<p></p>", {class: "small"}).append("Passwords must contain at least one letter and one number and must have a minimum 6 characters. No special characters.");

		var formInline = $("<form></form>", {class:"form-inline", role : "form"});

		
		//mix in one div form-group
		var label1 = $("<label></label>").append("Current Password:");
		var input1 = $("<input></input>", {type:"password", class:"form-control", name:"currentpass", id:"currentpass", placeholder:"Enter Current Password", required:"",
						pattern:'\\w+'});

		//mix in one div form-group
		var label2 = $("<label></label>").append("New Password:");
		var input2 = $("<input></input>", {type : "password", class : "form-control", name : "newpass", id : "password", placeholder:"Enter New Password", minlength: "6", 
										   required:"", pattern:'(?=.*\\d)(?=.*[a-zA-Z]).{6,}'});
		
		//mix in one div form-group
		var label3 = $("<label></label>").append("Confirm New Password:");
		var input3 = $("<input></input>", {type : "password", class : "form-control", name : "confirmnewpass", id : "passwordhashed",
										   placeholder:"Confirm New Password", onkeyup:"checkPass(); return false;",
										   minlength: "6", required:"", pattern:'(?=.*\\d)(?=.*[a-zA-Z]).{6,}'});
		var button3 = $("<button></button>", {type : "button", class : "btn btn-default", onclick:"", id : "changepassbutton"}).append("Change");
		//==============
		

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

		if(user_info.user.primary_phone||user_info.user.secondary_phone)
		{
			if(user_info.user.primary_phone&&user_info.user.secondary_phone)
			{
			//Phone
			var primaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Phone (Home): </strong>" + user_info.user.primary_phone + "</p>");
			var secondaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Phone (Cell): </strong>" + user_info.user.secondary_phone + "</p>");

			//Phone (Home,Cell)
			$('#profile').append($("<div></div>", {class:"row"}).append(primaryPhone,secondaryPhone));
			}

			else if(user_info.user.secondary_phone)
			{
			var secondaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Phone (Cell): </strong>" + user_info.user.secondary_phone + "</p>");

			//Phone (cell)
			$('#profile').append($("<div></div>", {class:"row"}).append(secondaryPhone));
			}
			else
			{
			//Phone
			var primaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Phone (Home): </strong>" + user_info.user.primary_phone + "</p>");

			//Phone (Home)
			$('#profile').append($("<div></div>", {class:"row"}).append(primaryPhone));
			}
		}

		//Date of Birth
		$('#profile').append($("<div></div>", {class:"row"}).append(dob));

		//check if user is a student
		if(user_info.user.student==1)
		{
			//Student Info
			var student = $("<h3></h3>").append("Student Information");
			//School Name and Grade
			var schoolname = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>School Name: </strong>" + user_info.student_info.school_name + " </p>");
			var grade = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Grade: </strong>" + user_info.student_info.grade + " </p>");
			
			//Student Info
			$('#profile').append(student);
			//School Name and grade
			$('#profile').append($("<div></div>", {class:"row"}).append(
				schoolname, grade));

			if(user_info.student_info.major||user_info.student_info.esl_level)
			{
				if(user_info.student_info.major&&user_info.student_info.esl_level)
				{
					//Major and ESL
					var major = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Major: </strong>" + user_info.student_info.major + " </p>");
					var esl = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>ESL Level: </strong>" + user_info.student_info.esl_level + " </p>");

					//major and esl level
					$('#profile').append($("<div></div>", {class:"row"}).append(
						major, esl));
				}
				else if(user_info.student_info.major)
				{
					//Major
					var major = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Major: </strong>" + user_info.student_info.major + " </p>");

					//major
					$('#profile').append($("<div></div>", {class:"row"}).append(major));
				}
				else
				{
					//ESL
					var esl = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>ESL Level: </strong>" + user_info.student_info.esl_level + " </p>");

					//esl level
					$('#profile').append($("<div></div>", {class:"row"}).append(esl));
				}
			}
		}
		//Emergency Contact
		$('#profile').append(emInfo);

		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			$('#profile').append($("<h4></h4>").append("Contact #"+(i+1)+":"));
			$('#profile').append($("<div></div>", {class:"row"}).append(
			$("<div></div>", {class:"col-sm-6"}).append("<p><strong>First Name:</strong> " + user_info.emergency_contacts[i].fname + "</p>"),
			$("<div></div>", {class:"col-sm-6"}).append("<p><strong>Last Name:</strong> " + user_info.emergency_contacts[i].lname + "</p>"),
			$("<div></div>", {class:"col-sm-6"}).append("<p><strong>Relationship:</strong> " + user_info.emergency_contacts[i].relationship + "</p>"),
			$("<div></div>", {class:"col-sm-6"}).append("<p><strong>Phone:</strong> " + user_info.emergency_contacts[i].contact_phone + "</p>")));
		}

		//Add E-Contacts, Edit Info
		$('#profile').append($("<div></div>", {id: "addecontact", class: "hidden"}).append(newcontact, einputrow1, einputrow2));
		$('#profile').append(addContacts);
		addcontactbuttontoggle(user_info.emergency_contacts.length);
		$('#profile').append(editInfo);

		//===============
		//Change Password
		$('#profile').append(changePassword);
		$('#profile').append(cpHidden);
		cpHidden.append($("<div></div>").append(
			pText, formInline));

		//Using Closure Structure
		formInline.append($("<div></div>", {class:"form-group"}).append(
			label1, input1));

		formInline.append($("<div></div>", {class:"form-group"}).append(
			label2, input2));

		formInline.append($("<div></div>", {class:"form-group"}).append(
			label3, input3, button3));
		//================
	});
}

function addcontactbuttontoggle(contacts) {
	// Disables the add contact button if the user already has max contacts
	if (contacts >= 3) {
		$('#addcontact').prop('disabled', true);
	}
}

function editinfo () {
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#profile').contents().remove();
		var editinfo='';
		editinfo+='    <h3>Basic Information</h3>'
		editinfo+='    <form class="form-inline" name="editinformation" role="form">';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>First Name: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.fname + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Last Name: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control" name = "lname" id = "editlname" placeholder="eg. Smith" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.lname + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Username: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control" type="text" name ="username" id = "editusername" required pattern="\\w+" value = "' + user_info.user.username + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Email: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control" type="email" name = "email" id = "editemail" placeholder="Enter email" required pattern="[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\\b" value = "' + user_info.user.email + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Phone (Home): </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" oninvalid = "editsetCustomValidity(\'Invalid phone number.\')" onchange="try{setCustomValidity(\'\')}catch(e){}" value = "' + user_info.user.primary_phone + '">';;
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Phone (Cell): </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" oninvalid = "editsetCustomValidity(\'Invalid phone number.\')" onchange="try{setCustomValidity(\'\')}catch(e){}" value = "' + user_info.user.secondary_phone + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Gender: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <select class = "form-control" name = "gender" id = "editgender" placeholder="Gender" required>';
		editinfo+='                <option value="" disabled selected>Please Select</option>';
		editinfo+='                <option '
		if (user_info.user.gender == "Male") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Male">Male</option>';
		editinfo+='                <option '
		if (user_info.user.gender == "Female") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Female">Female</option>';
		editinfo+='                <option '
		if (user_info.user.gender == "Other") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Other">Other</option>';
		editinfo+='            </select>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Date of Birth: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "editdatepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" required value = "' + String(user_info.user.birth_date).substring(0, 10) + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Address: </strong></p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control" name = "address" id = "editaddress" required pattern="^[a-zA-Z0-9._ ]*$" oninvalid = "editsetCustomValidity(\'Invalid address.\')" onchange="try{setCustomValidity(\'\')}catch(e){}" value = "' + user_info.user.address + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		//check if user is a student
		if(user_info.user.student==1)
		{
			editinfo+='    <h3>Student Information</h3>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>School Name: </strong></p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>Grade: </strong></p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>Major: </strong></p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>ESL Level: </strong></p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		editinfo+='    <h3>Emergency Contacts</h3>';
		editinfo+='    <h4>Contact #1:</h4>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>First Name:</strong> At</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Last Name:</strong> Sagad</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Relationship:</strong> This</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Phone:</strong> 123</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <h4>Contact #2:</h4>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>First Name:</strong> At</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Last Name:</strong> Sagad</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Relationship:</strong> This</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Phone:</strong> 123</p>';
		editinfo+='            </label>';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='</form>';
		editinfo+='<div class="row form-group col-sm-12">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='</div>';
		editinfo+='<div class="row form-group col-sm-12">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="returntoprofile()">Return</button>';
		editinfo+='</div>';
		$('#profile').append(editinfo);
	});
}

function savechanges() {
	alert("not yet implemented");
}

function returntoprofile(){
	var confirmation = confirm('Are you sure you wish to discard all changes?');
	if (confirmation) {
		load_profile();
	}
}

//Display list of registerable courses
function listcourses(){
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
			var coursename = $("<p></p>", {id: "coursename"}).append(data[i].course_name);
			var courseid = $("<p></p>", {id: "courseid"}).append("Course ID:", data[i].course_id);

			var collapse2 = $("<div></div>", {id: "collapse" + i, class: "panel-collapse collapse"});
			var panelbody = $("<div></div>", {class: "panel-body"});

			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"form-group col-sm-6"});
			var description = $("<p></p>", {id: "description"}).append("<strong>Description: </strong>").append(data[i].course_description);
			var startdate = $("<p></p>", {id: "coursestartdate"}).append("<strong>Start Date: </strong>" + String(data[i].start_date).substring(0, 10));
			var enddate = $("<p></p>", {id: "courseenddate"}).append("<strong>End Date: </strong>" + String(data[i].end_date).substring(0, 10));
			var coursetime = $("<p></p>", {id: "coursetime"}).append("<strong>Time: </strong>" + data[i].course_time);
			var courseinterval = $("<p></p>", {id: "courseinterval"}).append("<strong>Interval: </strong>" + data[i].course_interval);
			var coursedays = $("<p></p>", {id: "coursedays"}).append("<strong>Days: </strong>" + data[i].course_days);
			var coursetarget = $("<p></p>", {id: "coursetarget"}).append("<strong>Target: </strong>" + data[i].course_target);
			var coursecost = $("<p></p>", {id: "cost"}).append("<strong>Cost: </strong>$" + data[i].default_fee);
			var button = $("<button></button>", {type: "submit", class: "btn btn-default course-submit", onclick: "register(this)", method:'POST', id:"submit"+data[i].course_id}).append("Register Now!!");


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
										 	$("<div></div>", {class:"form-group col-sm-12"}).append(
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
										 		coursecost),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		button)));			//escaping closures

			
			courses.append(panel_default);
		}

		$('#courses').append(courses);
	});
}

//Show a personal user schedule
function listschedule(){
	jQuery.getJSON("/user/profile/schedule", function(data){
		
		$('#schedule').contents().remove();
		
		var courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < data.length; i++){
			//A Course Accordion Panel
			var panel_default = $("<div></div>", {class: "panel panel-primary"});
			
			var panel_heading = $("<div></div>", {class: "panel-heading"});
			var panel_title = $("<h4></h4>", {class: "panel-title"});
			var collapse = $("<a></a>", {href: "#scollapse"+i});
			collapse.attr("data-toggle", "collapse");

			var coursename = $("<div></div>", {class: "col-sm-6"}).append(data[i].course_name);
			var courseid = $("<div></div>", {class: "col-sm-offset-3 col-sm-3"}).append("Course ID:", data[i].course_id);

			var coursetime = $("<div></div>", {class: "col-sm-4"}).append("Time: " + data[i].course_time);
			var courseinterval = $("<div></div>", {class: "col-sm-offset-1 col-sm-3"}).append("Interval: " + data[i].course_interval);
			var coursedays = $("<div></div>", {class: "col-sm-offset-1 col-sm-3"}).append("Days: " + data[i].course_days);

			var collapse2 = $("<div></div>", {id: "scollapse" + i, class: "panel-collapse collapse"});
			var panelbody = $("<div></div>", {class: "panel-body"});

			var row = $("<div></div>", {class: "row"});
			var row2 = $("<div></div>", {class: "row"});

			var offset = $("<div></div>",{class: "col-sm-offset-1"});
			var description = $("<p></p>", {id: "description"}).append("Description: "+ data[i].course_description);
			var enddate = $("<p></p>", {id: "courseenddate"}).append("End Date: " + String(data[i].end_date).substring(0, 10));
			


			//=============================
			//Top Down compilation hierarchy
			//=============================
			panel_default = panel_default.append(panel_heading,collapse2);

			//--------------------------
			//First div of panel-default
			panel_heading = panel_heading.append(panel_title);
			panel_title = panel_title.append(collapse);
			

			row = row.append(coursename,courseid);
			row = row.append("<br>"+"<br>");
			row2 = row2.append(coursetime,courseinterval,coursedays);
			collapse = collapse.append(row,row2);
			//--------------------------
			//Second div of panel-default

			offset = offset.append(description,enddate);
			panelbody = panelbody.append(offset);
			collapse2 = collapse2.append(panelbody);

			courses.append(panel_default);
		}

		$('#schedule').append(courses);
	});
}
