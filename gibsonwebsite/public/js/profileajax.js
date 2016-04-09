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
	$.post("/register", {
			course_id: course_register.value,
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		swal({
			title: "Course added to Cart.",
			type: "success"
		});
		$('#cart').trigger('cookieUpdate');
		listcourses();

	})
	.fail(function (err){
		swal({
			title: "You have already registered for this course!"
		});
	});
}

function load_profile(){
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#profile').contents().remove();
		var profileinfo='';
		profileinfo+='    <hr>';
		profileinfo+='    <h3>Personal Information</h3>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Username</span><span class="col-sm-9 fieldval">' + user_info.user.username + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
        profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Name</span><span class="col-sm-9 fieldval">' + user_info.user.fname + " " + user_info.user.lname +'</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Email</span><span class="col-sm-9 fieldval">' + user_info.user.email + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		//Checks if phone number exist
		if(user_info.user.primary_phone||user_info.user.secondary_phone)
		{
			if(user_info.user.primary_phone&&user_info.user.secondary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Home)</span><span class="col-sm-9 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Cell)</span><span class="col-sm-9 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else if(user_info.user.primary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Home)</span><span class="col-sm-9 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone (Cell)</span><span class="col-sm-9 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
		}

        + ", " + user_info.user.prov_abb + ", " + user_info.user.postal_code
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Gender</span><span class="col-sm-9 fieldval">' + user_info.user.gender + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Date of Birth</span><span class="col-sm-9 fieldval">' + String(user_info.user.birth_date).substring(0, 10) + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-2 fieldname">Address</span><span class="col-sm-9 fieldval">' + user_info.user.address + '</span></p>';
        profileinfo+='            <p><span class="col-sm-2 fieldname"></span><span class="col-sm-9 fieldval">' + user_info.user.city + ", " + user_info.user.prov_abb + ", " + user_info.user.postal_code+ '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		if (user_info.user.unit_no != "") {
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Apt/Unit #</span><span class="col-sm-9 fieldval">' + user_info.user.unit_no + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
		}
		profileinfo+='    </div>';
		//check if user is a student
		if(user_info.user.student==1)
		{
			profileinfo+='    <hr>';
			profileinfo+='    <h3>Student Information</h3>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">School Name</span><span class="col-sm-9 fieldval">' + user_info.student_info.school_name + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Grade/Year</span><span class="col-sm-9 fieldval">' + user_info.student_info.grade + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			if(user_info.student_info.major||user_info.student_info.esl_level)
			{
				if(user_info.student_info.major&&user_info.student_info.esl_level)
				{
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-2 fieldname">Major</span><span class="col-sm-9 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='    	  </div>';
					profileinfo+='    </div>';
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-2 fieldname">ESL Level</span><span class="col-sm-9 fieldval">' + user_info.student_info.esl_level + '</span></p>';
					profileinfo+='        </div>';
					profileinfo+='    </div>';
				}
				else if(user_info.student_info.major)
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-2 fieldname">Major</span><span class="col-sm-9 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='      </div>';
					profileinfo+='  </div>';
				}
				else
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-2 fieldname">ESL Level</span><span class="col-sm-9 fieldval">' + user_info.student_info.esl_level + '</span></p>';
					profileinfo+='      </div>';
					profileinfo+='  </div>';
				}
			}
		}
		profileinfo+='    <hr>';
		profileinfo+='    <h3>Emergency Contacts</h3>';
		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			profileinfo+='    <h4>Contact #'+(i+1)+'</h4>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Name</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].fname + user_info.emergency_contacts[i].lname + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Relationship</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].relationship + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-2 fieldname">Phone</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].contact_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
		}
		profileinfo+='    <hr>';

		$('#profile').append(profileinfo);

		var editInfo = '';
		editInfo+='<div class="row form-group col-sm-12">';
		editInfo+='    <button type="button" class="btn btn-default" onclick="editinfo()" id="editinfo">Edit Information</button>';
		editInfo+='</div>';

		//===============
		var csrf = '<input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
		//Change Password
		var changePassword = '';
		changePassword+='<div class="row form-group form-group-sm col-sm-12">';
		changePassword+='    <button id="changepassbutton" onclick="togglepassworddropdown()" class="btn btn-default" type="button">Change Password</button>';
		changePassword+='</div>';
		changePassword+='<div style="display: block;" class="changepassdesign hidden form-group form-group-sm row col-sm-12" id="change_password">';
		changePassword+='    <div>';
		changePassword+='        <p class="small">Passwords must contain at least one letter and one number and must have a minimum 6 characters. No special characters.</p>';
		changePassword+='        <form role="form" method="post" action="/user/profile/changepassword" class="form-inline" id = "change_password_form">';
		changePassword+='            <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
		changePassword+='            <label>Current Password:</label>';
		changePassword+='            <input type="password" pattern="\\w+" placeholder="Enter Current Password" id="currentpass" name="currentpass" class="form-control">';
		changePassword+='            <label>New Password:</label>';
		changePassword+='            <input onkeyup="checkPass(); return false;" minlength="6" placeholder="Enter New Password" id="password" name="newpass" class="form-control" type="password">';
		changePassword+='            <label>Confirm New Password:</label>';
		changePassword+='            <input minlength="6" onkeyup="checkPass(); return false;" placeholder="Confirm New Password" id="passwordhashed" name="confirmnewpass" class="form-control" type="password">';
		changePassword+='            <button id="changepassbutton" class="btn btn-default submitbutton" type="button" onClick="changepassword()">Change</button>';
		changePassword+='        </form>';
		changePassword+='    </div>';
		changePassword+='</div>';

		//Add Edit Info
		$('#profile').append(editInfo);

		//===============
		//Change Password
		$('#profile').append(changePassword);

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

function editinfo () {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	jQuery.getJSON("/user/profile/info", function(user_info){
		// window.onbeforeunload = function () {
		// 	return 'Your changes have not been saved.';
		// };
		$('#profile').contents().remove();
		var editinfo='';
		editinfo+='    <hr>';
		editinfo+='    <h3>Basic Information</h3>';
		editinfo+='    <form class="form-inline" name="editinformation" id="editinformation" action="/user/profile/edit" method="POST" role="form">';
		editinfo+='    <input type="hidden" name="username" id="username" value="' + user_info.user.username + '">';
		editinfo+='    <input type="hidden" name="_csrf" id="_csrf" value="<%= csrfToken %>">';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Username: </p>';
		editinfo+='            </label>';
		editinfo+='            <p id = "displayusername" class="editinfotext">' + user_info.user.username + '</p>';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='			   <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Email: </p>';
		editinfo+='            </label>';
		editinfo+='            <p id = "displayemail" class="editinfotext">' + user_info.user.email + '</p>';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>First Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.fname + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='			   <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Last Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "lname" id = "editlname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.lname + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Phone (Home): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.primary_phone + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Phone (Cell): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.secondary_phone + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Gender: </p>';
		editinfo+='            </label>';
		editinfo+='            <select class = "form-control col-sm-4 editselect" name = "gender" id = "editgender">';
		editinfo+='                <option ';
		if (user_info.user.gender == "Male") { editinfo+= 'selected '; }
		editinfo+='value = "Male">Male</option>';
		editinfo+='                <option ';
		if (user_info.user.gender == "Female") { editinfo+= 'selected '; }
		editinfo+='value = "Female">Female</option>';
		editinfo+='                <option ';
		if (user_info.user.gender == "Other") { editinfo+= 'selected '; }
		editinfo+='value = "Other">Other</option>';
		editinfo+='            </select>';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Date of Birth: </p>';
		editinfo+='            </label>';
  		editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" value = "' + String(user_info.user.birth_date).substring(0, 10).replace(/-/g, "\/") + '">';
  		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Address: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "address" id = "editaddress" pattern="^[a-zA-Z0-9._ ]*$" value = "' + user_info.user.address + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Postal Code: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="A1A1A1" pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" value = "' + user_info.user.postal_code + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Apt/Unit #: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "number" class = "form-control col-sm-4" name = "apt" id = "apt" value = "' + user_info.user.unit_no + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>City: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "city" id = "city" pattern="[a-zA-Z. ]+" value = "' + user_info.user.city + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-5">';
		editinfo+='                <p>Province: </p>';
		editinfo+='            </label>';
		editinfo+='            <select class = "form-control col-sm-4 editselect" name = "editprovince" id = "editprovince">';
		for (var i = 0; i < user_info.provinces_list.length; i++) {
			//editinfo+='                <option value="user_info.provinces_list[i].province_id"';
			editinfo+='                <option';
			if (user_info.user.prov_abb == user_info.provinces_list[i].prov_abb) {
				editinfo+=' selected';
			}
			editinfo+='>' + user_info.provinces_list[i].prov_abb + '</option>';
		}
		editinfo+='            </select>';
		editinfo+='        </div>';
		editinfo+='    </div>';
		//check if user is a student
		if(user_info.user.student==1)
		{
			editinfo+='    <hr>';
			editinfo+='    <h3>Student Information</h3>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Grade/Year: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
			editinfo+='    	  </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>ESL Level: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		else {
			editinfo+='    <hr>';
			editinfo+='    <h3>Student Information</h3>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Grade: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='    	  </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>ESL Level: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		editinfo+='    <hr>';
		editinfo+='    <h3>Emergency Contacts</h3>';
		// The user's existing emergency contacts
		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			editinfo+='<div id = "contact' + (i+1) + '" class = "ECdisplay">';
			editinfo+='    <h4>Contact #'+(i+1)+':</h4>';
			editinfo+='    <div class="row" id = "contact' + (i+1) + '">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + (i+1) + '"  id = "emergencyfname' + (i+1) + '" placeholder= "" pattern= "[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].fname + '" >';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Last Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + (i+1) + '"  id = "emergencylname' + (i+1) + '" placeholder="" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].lname + '" >';
			editinfo+='        </div>';
			// No delete button for the first contact
			if (i != 0) {
				editinfo+='        <button type = "button" class= "btn btn-danger" id = "delete' + (i+1) + '" onclick="deletecontact(' + (i+1) +')">Delete</button>';
			}
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + (i+1) + '" id = "relationship' + (i+1) + '" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].relationship + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Phone: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "ephone' + (i+1) + '" id = "ephone' + (i+1) + '" maxlength="16" pattern="\w+" value = "' + user_info.emergency_contacts[i].contact_phone + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='</div>';
		}
		// Forms for not-yet-created emergency contacts
		for (var i = user_info.emergency_contacts.length+1; i<=3; i++) {
	        editinfo+='<div id = "contact' + i + '" class = "hidden">';
	        editinfo+='    <h4>Contact #'+ i +':</h4>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + i + '"  id = "emergencyfname' + i + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Last Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + i + '"  id = "emergencylname' + i + '"  placeholder="" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-5">';
			editinfo+='                <p>Phone: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "ephone' + i + '" id = "ephone' + i + '" maxlength="16" pattern="\w+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='</div>';
		}
		// Add and remove contacts buttons
		editinfo+='<div class="row">';
		editinfo+='    <div class = "form-group col-sm-12 smallmargin">';
		editinfo+='        <button type = "button" class = "btn btn-default" onclick="addcontact()" id = "addbutton"';
		// Disables add contact button if user is at max
		if (user_info.emergency_contacts.length == 3)
		{
			editinfo+=' disabled';
		}
		editinfo+='>Add another contact</button>';
		editinfo+='        <button type = "button" class = "btn btn-default';
		if (user_info.emergency_contacts.length == 1) {
			editinfo+=' hidden';
		}
		editinfo+='" onclick="removecontact()" id = "removebutton" disabled>Remove a contact</button>';
		editinfo+='    </div>';
		editinfo+='</div>';
		editinfo+='<hr>';

		var changePassword = '';
		changePassword+='<div class="row form-group form-group-sm col-sm-12">';
		changePassword+='    <button id="changepassbutton" onclick="togglepassworddropdown()" class="btn btn-default" type="button">Change Password</button>';
		changePassword+='</div>';
		changePassword+='<div style="display: block;" class="changepassdesign hidden form-group form-group-sm row col-sm-12" id="change_password">';
		changePassword+='    <p class="small">Passwords must contain at least one letter and one number and must have a minimum 6 characters. No special characters.</p>';
		changePassword+='    <form role="form" method="post" action="/user/profile/changepassword" class="form-inline" id = "change_password_form">';
		changePassword+='        <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
		changePassword+='        <label>Current Password:</label>';
		changePassword+='        <input type="password" pattern="\\w+" placeholder="Enter Current Password" id="currentpass" name="currentpass" class="form-control">';
		changePassword+='        <label>New Password:</label>';
		changePassword+='        <input onkeyup="checkPass(); return false;" minlength="6" placeholder="Enter New Password" id="password" name="newpass" class="form-control" type="password">';
		changePassword+='        <label>Confirm New Password:</label>';
		changePassword+='        <input minlength="6" onkeyup="checkPass(); return false;" placeholder="Confirm New Password" id="passwordhashed" name="confirmnewpass" class="form-control" type="password">';
		changePassword+='        <button id="changepassbutton" class="btn btn-default submitbutton" type="button" onClick="changepassword()">Change</button>';
		changePassword+='    </form>';
		changePassword+='</div>';

		editinfo += changePassword;
		editinfo+='<div class="row form-group col-sm-12 savechanges">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='    <button type="button" class="btn btn-default" onclick="returntoprofile()">Return</button>';
		editinfo+='</div>';
		editinfo+='</form>';
		$('#profile').append(editinfo);
		$('#editinformation').validate({
			rules: {
				editfname: {
					required: true
				},
				editlname: {
					required: true
				},
				gender: {
					required: true
				},
				birth_date: {
					required: true
				},
				address: {
					required: true
				},
				postal_code: {
					required: true
				},
				city: {
					required: true
				},
				province: {
					required: true
				}
			}
		});
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
		$('#datepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
	});
}

function savechanges() {
	// Tests for validity
	if ($("#editinformation").valid()) {
		$.post("/user/profile/edit", {
				_csrf: $('#_csrf').val(),
				username: $('#username').val(),
				fname: $('#editfname').val(),
				lname: $('#editlname').val(),
				primary_phone: $('#editprimary_phone').val(),
				secondary_phone: $('#editsecondary_phone').val(),
				gender: $('#editgender').val(),
				birth_date: $('#datepicker').val(),
				address: $('#editaddress').val(),
				postal_code: $('#postal_code').val(),
				city: $('#city').val(),
				unit_no: $('#apt').val(),
				province: $('#editprovince option:selected').text(),
				schoolname: $('#editschoolname').val(),
				grade: $('#editgrade').val(),
				major: $('#editmajor').val(),
				esl: $('#editesl').val(),
															////////////////////////////////////////////////////////////////// emergency contacts
				emergencyfname1: $('#emergencyfname1').val(),
				emergencyfname2: $('#emergencyfname2').val(),
				emergencyfname3: $('#emergencyfname3').val(),
				emergencylname1: $('#emergencylname1').val(),
				emergencylname2: $('#emergencylname2').val(),
				emergencylname3: $('#emergencylname3').val(),
				relationship1: $('#relationship1').val(),
				relationship2: $('#relationship2').val(),
				relationship3: $('#relationship3').val(),
				ephone1: $('#ephone1').val(),
				ephone2: $('#ephone2').val(),
				ephone3: $('#ephone3').val()

		})
		.done(function (res){
			swal({
				title: "Profile updated.",
				type: "success"
			});
		})
		.fail(function (err){
			swal({
				title: "Failed to save changes.",
				type: "error"
			});
		});
		window.onbeforeunload = null;
		// setTimeout(function(){
		// 	$("html, body").animate({ scrollTop: 0 }, "slow");
		// }, 300);
    }
}

var preventUser = function() {
    return "Your work will be lost";
};





//Global variable allAvailableCourses
var allAvailableCourses;

//Display list of registerable courses
function listcourses(){
	jQuery.getJSON("/user/profile/courses", function(data_unfiltered){

		allAvailableCourses = data_unfiltered;
		showFilteredCourses(allAvailableCourses, '');
	});
}

// Filters list of courses.
// Kevin dindu nuffin, so dun ask him if this breaks.
function filterCourses(searchText){

	// Splits a string into an array of string, split along the ' '(space) character
	var stopWords = ["", "and", "are", "but", "etc", "for", "had", "has", "its", "not", "our", "ours", "than", "that", "the", "then", "too", "via", "was", "who", "you"];
	var searchTerms = $.grep(searchText.replace(/\W*\b\w{1,2}\b/g, "").toLowerCase().split(' '), function(x) {return $.inArray(x, stopWords) < 0;});
	//var searchTerms = searchText.toLowerCase().split(' ');
	var filteredCourses = [];
	var match = false;

	// Very crude word match search
	if (searchTerms.length === 0){
		filteredCourses = allAvailableCourses;
	}
	else{
		for (var i = 0; i < allAvailableCourses.length; i++){
			for (var j = 0; j < searchTerms.length; j++){
				if(allAvailableCourses[i].course_name.toLowerCase().indexOf(searchTerms[j]) > -1 ||
					 allAvailableCourses[i].course_description.toLowerCase().indexOf(searchTerms[j]) > -1 ||
				 	 allAvailableCourses[i].course_code.toLowerCase().indexOf(searchTerms[j]) > -1 ||
				 	 allAvailableCourses[i].course_target.toLowerCase().indexOf(searchTerms[j]) > -1){

					match = true;
				}
				else{
					match = false;
					break;
				}
			}

			if (match){
				filteredCourses.push(allAvailableCourses[i]);
			}
		}
	}

	showFilteredCourses(filteredCourses, searchText);
}

//Display list of registerable courses
// Actually displaying courses.
function showFilteredCourses(data, searchText){
	$('#courses').contents().remove();

	var courses = '';
	courses += '<div id="coursesaccordion" class="panel-group">';
    courses += '<hr>';
    courses += '<h3>List of Available Courses</h3>'; 

	courses += '	<div class="search-box">';
	courses += '		<p><b>Filter Courses</b></p>';
	courses += '		<input class="search-bar" type="text" name="searchText" id="searchText" onkeyup="filterCourses(this.value)" value="' +searchText +'" placeholder="Search..."/>';
	courses += '	</div>';

	for(var i = 0; i < data.length; i++) {

			courses += '    <div class="panel panel-primary">';
			courses += '        <div class="panel-heading">';
			courses += '            <h4 class="panel-title">';
			courses += '                <a aria-expanded="false" class="collapsed" data-toggle="collapse" href="#collapse' + i + '">';
			courses += '                    <div class="row">';
			courses += '                        <div class="col-sm-9">' + data[i].course_name +'</div>';
			courses += '                        <div class="col-sm-3">Course Code: ' + data[i].course_code + '</div>';
			courses += '                    </div>';
			courses += '                </a>';
			courses += '            </h4>';
			courses += '        </div>';
			courses += '        <div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="collapse' + i + '">';
			courses += '          	<div class="panel-body">';
			courses += '        	<div class="col-sm-offset-1">';

            //*** AJAX for Generating Description ***//
			courses += '        		<div class="row">';
			courses += '            		<div class="col-sm-4">';
			courses += '                		<p id="descriptiontitle' + i + '"><b>Description:</b></p>';
			courses += '        			</div>';
			courses += '            		<div class="col-sm-8">';
            courses += '                		<p id="description' + i + '">' + data[i].course_description + '</p>';
			courses += '        			</div>';
			courses += '        		</div>';

        
            
            //*** ATTENTION!! NEED TO ASK YYYY-MM-DD to Jun 11, 2016 style ***//
            //*** AJAX for Generating Period ***//
			courses += '        		<div class="row largemargin">';
			courses += '            		<div class="col-sm-4">';
			courses += '               		 	 <p id="courseperiodtitle' + i + '"><b>Period:</b></p>';
			courses += '            		</div>';
            courses += '            	   <div class="col-sm-8">';
			courses += '               		 	 <p id="courseperiod' + i + '">' + String(data[i].start_date).substring(0, 10) + ' to ' + String(data[i].end_date).substring(0, 10) + '</p>';
			courses += '            		</div>'
			courses += '        		</div>';

            //*** AJAX for Generating Target ***//
			courses += '        		<div class="row">';
			courses += '        	    	<div class="col-sm-4">';
			courses += '        	        	 <p id="coursetargettitle' + i + '"><b>Target:</b></p>';
			courses += '         	   		</div>';
            courses += '        	    	<div class="col-sm-8">';
			courses += '        	        	 <p id="coursetarget' + i + '">' + data[i].course_target + '</p>';
			courses += '         	   		</div>';
			courses += '        		</div>';


            //*** AJAX for Generating Language ***//
            courses += '        		<div class="row">';
			courses += '        	    	<div class="col-sm-4">';
			courses += '        	        	 <p id="courselanguagetitle' + i + '"><b>Language:</b></p>';
			courses += '         	   		</div>';
        	

        	//*** JQuery Loop for Generating Languages ***//
			if(data[i].course_language != null){
				for(var j = 0; j < JSON.parse(data[i].course_language).length; j++){
					var lang = JSON.parse(data[i].course_language)[j];
					courses += '            <div class="col-sm-8">';
                    courses += '                 <p id="courselanguage' + i + '">' + lang + '</p>';
					courses += '            </div>';
				}
			}
            courses += '                 </div>';

            //*** AJAX for Header of Date(s) and Time(s) ***//
            courses += '        		<div class="row largemargin">';
            courses += '            		<div class="col-sm-4">';
            courses += '                		<p id="coursetimetitle' + i + '"><b>Date(s) and Time(s):</b></p>';
            courses += '            		</div>';

            //*** AJAX Loop for Generating Day-Time ***//
            if(data[i].course_days != null){
            	for (var j = 0; j < JSON.parse(data[i].course_days).length; j++ ){
                	var days = JSON.parse(data[i].course_days)[j].day;
                    var time = JSON.parse(data[i].course_days)[j].start_time + "&nbsp" + " - " + "&nbsp;" + JSON.parse(data[i].course_days)[j].end_time;
                    if (j != 0){
                        courses += '            		<div class="col-sm-4">';
                        courses += '            		</div>';           
                    }
                    
					courses += '            <div class="col-sm-8 timedatefix">';
                    courses += '                 <p id="coursetime" class="col-xs-2">' + days + '</p>';
                    courses += '                 <p id="coursetime" class="col-xs-10">' + time + '</p>';
					courses += '            </div>';

            	}
            }
            courses += '        </div>';

            //*** Cost and Button for Adding the Course to the Cart ***//
			courses += '        		<div class="row largemargin">';
            courses += '          	  		<div class="col-sm-4">';
			courses += '         	         	<p id="cost' + i + '"><b>Cost:</b></p>';
			courses += '        	    	</div>';
            courses += '          	  		<div class="col-sm-1">';
			courses += '         	         	<p id="cost' + i + '">$' + data[i].default_fee + '</p>';
			courses += '        	    	</div>';
			courses += '            		<div class="col-sm-4">';
			courses += '            			<button type="submit" action="/register" class="btn btn-default course-submit" onclick="register(this)" method="POST" id="submit" value="' + data[i].course_id +'">Add to Cart</button>';
			courses += '            		</div>';
			courses += '       			</div>';
        
		courses += '    <div class="panel panel-primary">';
		courses += '        <div class="panel-heading">';
		courses += '            <h4 class="panel-title">';
		courses += '                <a aria-expanded="false" class="collapsed" data-toggle="collapse" href="#collapse' + i + '">';
		courses += '                    <div class="row">';
		courses += '                        <div class="col-sm-9">' + data[i].course_name +'</div>';
		courses += '                        <div class="col-sm-3">Course Code: ' + data[i].course_code + '</div>';
		courses += '                    </div>';
		courses += '                </a>';
		courses += '            </h4>';
		courses += '        </div>';
		courses += '        <div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="collapse' + i + '">';
		courses += '          	<div class="panel-body">';
		courses += '        	<div class="col-sm-offset-1">';

        //*** AJAX for Generating Description ***//
		courses += '        		<div class="row">';
		courses += '            		<div class="col-sm-12">';
		courses += '                		<p id="descriptiontitle' + i + '"><b>Description: </b></p>';
		courses += '        			</div>';
		courses += '        		</div>';
        courses += '        		<div class="row">';
		courses += '            		<div class="col-sm-12 courseindent">';
        courses += '                		<p id="description' + i + '">' + data[i].course_description + '</p>';
		courses += '        			</div>';
		courses += '        		</div>';

        //*** AJAX for Generating Period ***//
		courses += '        		<div class="row">';
		courses += '            		<div class="col-sm-12">';
		courses += '               		 	 <p id="courseperiod' + i + '">Period: ' + String(data[i].start_date).substring(0, 10) + ' to ' + String(data[i].end_date).substring(0, 10) + '</p>';
		courses += '            		</div>';
		courses += '        		</div>';

        //*** AJAX for Generating Target ***//
		courses += '        		<div class="row">';
		courses += '        	    	<div class="col-sm-12">';
		courses += '        	        	 <p id="coursetarget' + i + '">Target: ' + data[i].course_target + '</p>';
		courses += '         	   		</div>';
		courses += '        		</div>';


        //*** AJAX for Generating Language ***//
        courses += '        		<div class="row">';
		courses += '        	    	<div class="col-sm-12">';
		courses += '        	        	 <p id="courselanguage' + i + '">Language:</p>';
		courses += '         	   		</div>';
		courses += '        		</div>';
    	

    	//*** JQuery Loop for Generating Languages ***//
		if(data[i].course_language != null){
			for(var j = 0; j < JSON.parse(data[i].course_language).length; j++){
				var lang = JSON.parse(data[i].course_language)[j];
				courses += '        		<div class="row">';
				courses += '            		<div class="col-sm-12">';
                courses += '                        <p><span class="col-sm-2"><b>' + "&nbsp;" + lang + '</b></span></p>';
				courses += '            		</div>';
				courses += '        		</div>';
			}
		}

        //*** AJAX for Header of Date(s) and Time(s) ***//
        courses += '        		<div class="row">';
        courses += '            		<div class="col-sm-12">';
        courses += '                		<p id="coursetimetitle' + i + '"><b>Date(s) and Time(s): </b></p>';
        courses += '            		</div>';
        courses += '        		</div>';

        
        //*** AJAX Loop for Generating Day-Time ***//
        if(data[i].course_days != null){
        	for (var j = 0; j < JSON.parse(data[i].course_days).length; j++ ){
            	var days = JSON.parse(data[i].course_days)[j].day;
                var time = JSON.parse(data[i].course_days)[j].start_time + "&nbsp;&nbsp;" + " - " + "&nbsp;&nbsp;" + JSON.parse(data[i].course_days)[j].end_time;
            	courses += '        		<div class="row">';
				courses += '            		<div class="col-sm-12">';
                courses += '                        <p id="coursedaytime"><span class="col-sm-2">' + "&nbsp;" + days + '</span><span class="col-sm-9">' + time + '</span></p>';
				courses += '            		</div>';
				courses += '        		</div>';

        	}
        }

        //*** Cost and Button for Adding the Course to the Cart ***//
		courses += '        		<div class="row largemargin">';
        courses += '          	  		<div class="col-sm-3">';
		courses += '         	         	<p id="cost' + i + '"><b>Cost: $' + data[i].default_fee + '</b></p>';
		courses += '        	    	</div>';
		courses += '            		<div class="col-sm-2 righttext">';
		courses += '            			<button type="submit" action="/register" class="btn btn-default course-submit" onclick="register(this)" method="POST" id="submit" value="' + data[i].course_id +'">Add to Cart</button>';
		courses += '            		</div>';
		courses += '       			</div>';




        //*** Closes all divs ***//
		courses += '        	</div>';
		courses += '        	</div>';
		courses += '        </div>';
		courses += '    </div>';


	}
	courses += '</div>';
	$('#courses').append(courses);

	//If there are no courses in search
	if(data.length < 1)
	{
		var empty_courses_html = '';
			empty_courses_html+= '<div> Oops! There are no courses available. </div>';

		$('#coursesaccordion').append(empty_courses_html);
	}
	
	$("#searchText").focus();
	var tmpStr = $("#searchText").val();
	$("#searchText").val('');
	$("#searchText").val(tmpStr);
}




//Show a personal user schedule
function listschedule(){
	jQuery.getJSON("/user/profile/schedule", function(data){
		$('#schedule').contents().remove();
		var schedule = '';
		schedule += '<div id="scheduleaccordion" class="panel-group">';
        schedule += '<hr>';
        schedule += '<h3>My Scheduled Courses</h3>';
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
			schedule += '                            <p id="coursestartdate' + i + '">Start Date: ' + String(data[i].start_date).substring(0, 10) + '</p>';
			schedule += '                    	 </div>';
			schedule += '                        <div class="col-sm-6">';
			schedule += '                            <p id="courseenddate' + i + '">End Date: ' + String(data[i].end_date).substring(0, 10) + '</p>';
			schedule += '                        </div>';
			schedule += '                        <div class="col-sm-3">Days of Week: ' + data[i].course_days + '</div>';
			schedule += '                    </div>';
			schedule += '                </div>';
			schedule += '            </div>';
			schedule += '        </div>';
			schedule += '    </div>';
		}
		//If there are no courses in search
		if(data.length < 1)
		{
			schedule+= '<div> Oops! You have no upcoming courses. </div>';
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
		swal({
				title: "Password changed successfully.",
				type: "success"
		});
		$.post("/login", {
			username: res[0].username,
			password: $('#password').val(),
			_csrf: $('#_csrf').val()
		});
	});
}

// Removes the contact specified by contact no
function deletecontact(contactno) {
	// Checks that the contact actually exists && and that the contact being
	// deleted isn't the first one (protection against HTML editing)
	if (document.getElementById('contact' + contactno) != null && contactno != 1) {
		var fname = $('#emergencyfname' + contactno).val();
		var lname = $('#emergencylname' + contactno).val();
		swal({
			title: "Are you sure?",
			text: 'Are you sure you want to remove '+fname+' '+lname+' as an emergency contact?',
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
  			closeOnConfirm: false
	},
	function(isConfirm){
		if (isConfirm) {
			// Gets the contact_id of the contact to be deleted
			jQuery.getJSON("/user/profile/info", function(user_info){
				var contact_id = user_info.emergency_contacts[contactno-1].contact_id;
			});
			//// POST
			//// do this on success:
			swal({
				title: "Contact removed.",
				text: '(but not really)',
				type: "success"
			});


		}
	});
	}
}

function returntoprofile() {
	swal({
		title: "Are you sure?",
		text: 'Are you sure you wish to discard all changes?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes",
		cancelButtonText: "No"
	},
	function(isConfirm){
		if (isConfirm) {
			load_profile();
			window.onbeforeunload = null;
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}
	});
}


// Migrated from navbarajax

$('#cart').on('cookieUpdate', function(){
    var num_courses = getNumCourses();
	var number_string = " (" + num_courses + ")";
	$('a[href="/cart"]').contents().filter(function(){ return this.nodeType == 3; })[1].nodeValue = number_string;

	//Alternate attempt; cart icon disappears on update
	//var current_text = $('a[href="/cart"]').text();
	//current_text = current_text.slice(0, current_text.indexOf('(') + 1) + num_courses + ")";
	//$('a[href="/cart"]').text(current_text);
});



// Get number of courses
function getNumCourses(){
	var cart = getCookie('cart');
	if (cart != null) {
		cart = unescape(cart).substring(2);
		return num_courses = JSON.parse(cart).course_list.length;
	}
	return 0;
}
