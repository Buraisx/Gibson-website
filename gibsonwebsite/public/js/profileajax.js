
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
		listcourses();
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
		var profileinfo='';
		profileinfo+='    <hr>';
		profileinfo+='    <h3>Basic Information</h3>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">First Name:</span><span class="col-sm-7 fieldval">' + user_info.user.fname + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Last Name:</span><span class="col-sm-7 fieldval">' + user_info.user.lname + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Username:</span><span class="col-sm-7 fieldval">' + user_info.user.username + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Email:</span><span class="col-sm-7 fieldval">' + user_info.user.email + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		//Checks if phone number exist
		if(user_info.user.primary_phone||user_info.user.secondary_phone)
		{
			if(user_info.user.primary_phone&&user_info.user.secondary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Home):</span><span class="col-sm-7 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Cell):</span><span class="col-sm-7 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else if(user_info.user.primary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Home):</span><span class="col-sm-7 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Cell):</span><span class="col-sm-7 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
		}
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='                <p><span class="col-sm-2 fieldname">Gender:</span><span class="col-sm-7 fieldval">' + user_info.user.gender + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='                <p><span class="col-sm-2 fieldname">Date of Birth:</span><span class="col-sm-7 fieldval">' + String(user_info.user.birth_date).substring(0, 10) + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='                <p><span class="col-sm-2 fieldname">Address:</span><span class="col-sm-7 fieldval">' + user_info.user.address + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		//check if user is a student
		if(user_info.user.student==1)
		{
			profileinfo+='    <hr>';
			profileinfo+='    <h3>Student Information</h3>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">School Name:</span><span class="col-sm-7 fieldval">' + user_info.student_info.school_name + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Grade:</span><span class="col-sm-7 fieldval">' + user_info.student_info.grade + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			if(user_info.student_info.major||user_info.student_info.esl_level)
			{
				if(user_info.student_info.major&&user_info.student_info.esl_level)
				{
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-2 fieldname">Major:</span><span class="col-sm-7 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='    	  </div>';
					profileinfo+='    </div>';
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-2 fieldname">ESL Level:</span><span class="col-sm-7 fieldval">' + user_info.student_info.esl_level + '</span></p>';
					profileinfo+='        </div>';
					profileinfo+='    </div>';
				}
				else if(user_info.student_info.major)
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-2 fieldname">Major:</span><span class="col-sm-7 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='      </div>';
					profileinfo+='  </div>';
				}
				else
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-2 fieldname">ESL Level:</span><span class="col-sm-7 fieldval">' + user_info.student_info.esl_level + '</span></p>';
					profileinfo+='      </div>';
					profileinfo+='  </div>';
				}
			}
		}
		profileinfo+='    <hr>';
		profileinfo+='    <h3>Emergency Contacts</h3>';
		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			profileinfo+='    <h4>Contact #'+(i+1)+':</h4>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">First Name:</span><span class="col-sm-7 fieldval">' + user_info.emergency_contacts[i].fname + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Last Name:</span><span class="col-sm-7 fieldval">' + user_info.emergency_contacts[i].lname + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Relationship:</span><span class="col-sm-7 fieldval">' + user_info.emergency_contacts[i].relationship + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone:</span><span class="col-sm-7 fieldval">' + user_info.emergency_contacts[i].contact_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
		}
		$('#profile').append(profileinfo);

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

		var formInline = $("<form></form>", {class:"form-inline", action:"/user/profile/changepassword", method:"post", role : "form"});
		var csrf = '<input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';

		//mix in one div form-group
		var label1 = $("<label></label>").append("Current Password:");
		var input1 = $("<input></input>", {type:"password", class:"form-control", name:"currentpass", id:"currentpass", placeholder:"Enter Current Password", required:"",
						pattern:'\\w+'});

		//mix in one div form-group
		var label2 = $("<label></label>").append("New Password:");
		var input2 = $("<input></input>", {type : "password", class : "form-control", name : "newpass", id : "password", placeholder:"Enter New Password", minlength: "6",
										   onkeyup:"checkPass(); return false;", required:""});

		//mix in one div form-group
		var label3 = $("<label></label>").append("Confirm New Password:");
		var input3 = $("<input></input>", {type : "password", class : "form-control", name : "confirmnewpass", id : "passwordhashed",
										   placeholder:"Confirm New Password", onkeyup:"checkPass(); return false;",
										   minlength: "6", required:""});
		var button3 = $("<button></button>", {type : "button", class : "btn btn-default", id : "changepassbutton", onClick: "changepassword()"}).append("Change");

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
 		formInline.append(csrf);

 		formInline.append($("<div></div>", {class:"form-group"}).append(
 			label1, input1));

 		formInline.append($("<div></div>", {class:"form-group"}).append(
 			label2, input2));

 		formInline.append($("<div></div>", {class:"form-group"}).append(
 			label3, input3, button3));

		//================
		$('#change_password_form').validate({
			rules: {
				currentpass: {
					required: true
				},
				newpass: {
					required: true
				},
				confirmnewpass: {
					required: true
				}
			}
		});
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
		editinfo+='    <hr>';
		editinfo+='    <h3>Basic Information</h3>';
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
		editinfo+='            <input class = "form-control" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" oninvalid = "editsetCustomValidity(\'Invalid phone number.\')" onchange="try{setCustomValidity(\'\')}catch(e){}" value = "' + user_info.user.primary_phone + '">';
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
		editinfo+='                <option ';
		if (user_info.user.gender == "Male") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Male">Male</option>';
		editinfo+='                <option ';
		if (user_info.user.gender == "Female") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Female">Female</option>';
		editinfo+='                <option ';
		if (user_info.user.gender == "Other") { editinfo+= 'selected="selected" '; }
		editinfo+='value = "Other">Other</option>';
		editinfo+='            </select>';
		editinfo+='        </div>';
		editinfo+='        <div class="col-sm-6">';
		editinfo+='            <label>';
		editinfo+='                <p><strong>Date of Birth: </strong></p>';
		editinfo+='            </label>';
  		editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" required value = "' + String(user_info.user.birth_date).substring(0, 10).replace(/-/g, "\/") + '">';		editinfo+='        </div>';
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
			editinfo+='    <hr>';
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
		editinfo+='    <hr>';
		editinfo+='    <h3>Emergency Contacts</h3>';
		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			editinfo+='    <h4>Contact #'+(i+1)+':</h4>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>First Name:</strong>' + user_info.emergency_contacts[i].fname + '</p>';
			editinfo+='            </label>';
			editinfo+='        </div>';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>Last Name:</strong>' + user_info.emergency_contacts[i].lname + '</p>';
			editinfo+='            </label>';
			editinfo+='        </div>';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>Relationship:</strong>' + user_info.emergency_contacts[i].relationship + '</p>';
			editinfo+='            </label>';
			editinfo+='        </div>';
			editinfo+='        <div class="col-sm-6">';
			editinfo+='            <label>';
			editinfo+='                <p><strong>Phone:</strong>' + user_info.emergency_contacts[i].contact_phone + '</p>';
			editinfo+='            </label>';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		editinfo+='</form>';
		editinfo+='<div class="row form-group col-sm-12">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='</div>';
		editinfo+='<div class="row form-group col-sm-12">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="returntoprofile()">Return</button>';
		editinfo+='</div>';
		$('#profile').append(editinfo);
		$('#datepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
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
			var coursename = $("<div></div>", {class: "col-sm-5"}).append(data[i].course_name);
			var courseid = $("<div></div>", {class: "col-sm-7 righttext"}).append("Course Code: ", data[i].course_code);

			var collapse2 = $("<div></div>", {id: "collapse" + i, class: "panel-collapse collapse"});
			var panelbody = $("<div></div>", {class: "panel-body"});

			var row = $("<div></div>", {class: "row"});
			var colsm6 = $("<div></div>", {class:"form-group col-sm-6"});
			var description = $("<p></p>", {id: "description"}).append(data[i].course_description);
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
			row = row.append(coursename,courseid);
			collapse = collapse.append(row);

			//--------------------------
			//Second div of panel-default
			collapse2 = collapse2.append(panelbody);

			//DESCRIPTION
			panelbody = panelbody.append($("<div></div>", {class: "row"}).append(
										 	$("<div></div>", {class:"form-group col-sm-12"}).append(
										 		description)));		//escaping closures

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
		var schedule = '';
		schedule += '<div id="scheduleaccordion" class="panel-group">';
		for(i = 0; i < data.length; i++) {
			schedule += '    <div class="panel panel-primary">';
			schedule += '        <div class="panel-heading">';
			schedule += '            <h4 class="panel-title">';
			schedule += '                <a aria-expanded="false" class="collapsed" data-toggle="collapse" href="#scollapse' + i + '">';
			schedule += '                    <div class="row">';
			schedule += '                        <div class="col-sm-5">' + data[i].course_name +'</div>';
			schedule += '                        <div class="col-sm-7 righttext">Course Code: ' + data[i].course_code + '</div>';
			schedule += '                    </div>';
			schedule += '                </a>';
			schedule += '            </h4>';
			schedule += '        </div>';
			schedule += '        <div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="scollapse' + i + '">';
			schedule += '            <div class="panel-body">';
			schedule += '                <div class="col-sm-offset-1">';
			schedule += '                    <p id="description' + i + '">' + data[i].course_description + '</p>';
			schedule += '                    <div class="row">';
			schedule += '                        <div class="col-sm-6">';
			schedule += '                            <p id="coursestartdate' + i + '"><strong>Start Date: </strong>' + String(data[i].start_date).substring(0, 10) + '</p>';
			schedule += '                    	 </div>';
			schedule += '                        <div class="col-sm-6">';
			schedule += '                            <p id="courseenddate' + i + '"><strong>End Date: </strong>' + String(data[i].end_date).substring(0, 10) + '</p>';
			schedule += '                        </div>';
			schedule += '                        <div class="col-sm-3"><strong>Days of Week: </strong>' + data[i].course_days + '</div>';
			schedule += '                    </div>';
			schedule += '                </div>';
			schedule += '            </div>';
			schedule += '        </div>';
			schedule += '    </div>';
		}
		schedule += '</div>';
		$('#schedule').append(schedule);
	});
}

function changepassword(){
	$.post("/user/profile/changepassword", {
			currentpass: $('#currentpass').val(),
			newpass: $('#password').val(),
			confirmnewpass: $('#passwordhashed').val(),
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		alert("Password changed successfully.");
		$.post("/login", {
			username: getCookie('gibson_user'),
			password: $('#password').val(),
			_csrf: $('#_csrf').val()
		});
	});
}
