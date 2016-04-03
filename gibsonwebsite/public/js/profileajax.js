
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
		listcourses();
	})
	.fail(function (err){
		swal({
			title: "You have already registered for this course!"
		});
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
		profileinfo+='            <p><span class="col-sm-4 fieldname">First Name:</span><span class="col-sm-5 fieldval">' + user_info.user.fname + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Last Name:</span><span class="col-sm-5 fieldval">' + user_info.user.lname + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Username:</span><span class="col-sm-5 fieldval">' + user_info.user.username + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Email:</span><span class="col-sm-5 fieldval">' + user_info.user.email + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		//Checks if phone number exist
		if(user_info.user.primary_phone||user_info.user.secondary_phone)
		{
			if(user_info.user.primary_phone&&user_info.user.secondary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Phone (Home):</span><span class="col-sm-5 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Phone (Cell):</span><span class="col-sm-5 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else if(user_info.user.primary_phone)
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Phone (Home):</span><span class="col-sm-5 fieldval">' + user_info.user.primary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
			else
			{
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Phone (Cell):</span><span class="col-sm-5 fieldval">' + user_info.user.secondary_phone + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			}
		}
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Gender:</span><span class="col-sm-5 fieldval">' + user_info.user.gender + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Date of Birth:</span><span class="col-sm-5 fieldval">' + String(user_info.user.birth_date).substring(0, 10) + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Address:</span><span class="col-sm-5 fieldval">' + user_info.user.address + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		if (user_info.user.unit_no != "") {
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Apt/Unit #:</span><span class="col-sm-5 fieldval">' + user_info.user.unit_no + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
		}
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Postal Code:</span><span class="col-sm-5 fieldval">' + user_info.user.postal_code + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">City:</span><span class="col-sm-5 fieldval">' + user_info.user.city + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		profileinfo+='    <div class="row">';
		profileinfo+='        <div class="form-group col-sm-12">';
		profileinfo+='            <p><span class="col-sm-4 fieldname">Province:</span><span class="col-sm-5 fieldval">' + user_info.user.prov_abb + '</span></p>';
		profileinfo+='        </div>';
		profileinfo+='    </div>';
		//check if user is a student
		if(user_info.user.student==1)
		{
			profileinfo+='    <hr>';
			profileinfo+='    <h3>Student Information</h3>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">School Name:</span><span class="col-sm-5 fieldval">' + user_info.student_info.school_name + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Grade/Year:</span><span class="col-sm-5 fieldval">' + user_info.student_info.grade + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			if(user_info.student_info.major||user_info.student_info.esl_level)
			{
				if(user_info.student_info.major&&user_info.student_info.esl_level)
				{
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-4 fieldname">Major:</span><span class="col-sm-5 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='    	  </div>';
					profileinfo+='    </div>';
					profileinfo+='    <div class="row">';
					profileinfo+='        <div class="form-group col-sm-12">';
					profileinfo+='            <p><span class="col-sm-4 fieldname">ESL Level:</span><span class="col-sm-5 fieldval">' + user_info.student_info.esl_level + '</span></p>';
					profileinfo+='        </div>';
					profileinfo+='    </div>';
				}
				else if(user_info.student_info.major)
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-4 fieldname">Major:</span><span class="col-sm-5 fieldval">' + user_info.student_info.major + '</span></p>';
					profileinfo+='      </div>';
					profileinfo+='  </div>';
				}
				else
				{
					profileinfo+='  <div class="row">';
					profileinfo+='      <div class="form-group col-sm-12">';
					profileinfo+='           <p><span class="col-sm-4 fieldname">ESL Level:</span><span class="col-sm-5 fieldval">' + user_info.student_info.esl_level + '</span></p>';
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
			profileinfo+='            <p><span class="col-sm-4 fieldname">First Name:</span><span class="col-sm-5 fieldval">' + user_info.emergency_contacts[i].fname + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Last Name:</span><span class="col-sm-5 fieldval">' + user_info.emergency_contacts[i].lname + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Relationship:</span><span class="col-sm-5 fieldval">' + user_info.emergency_contacts[i].relationship + '</span></p>';
			profileinfo+='        </div>';
			profileinfo+='    </div>';
			profileinfo+='    <div class="row">';
			profileinfo+='        <div class="form-group col-sm-12">';
			profileinfo+='            <p><span class="col-sm-4 fieldname">Phone:</span><span class="col-sm-5 fieldval">' + user_info.emergency_contacts[i].contact_phone + '</span></p>';
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
		window.onbeforeunload = function () {
			return 'Your changes have not been saved.';
		};
		$('#profile').contents().remove();
		var editinfo='';
		editinfo+='    <hr>';
		editinfo+='    <h3>Basic Information</h3>';
		editinfo+='    <form class="form-inline" name="editinformation" id="editinformation" action="/user/profile/edit" method="POST" role="form">';
		editinfo+='    <input type="hidden" name="username" id="username" value="' + user_info.user.username + '">';
		editinfo+='    <input type="hidden" name="_csrf" id="_csrf" value="<%= csrfToken %>">';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>First Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.fname + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Last Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "lname" id = "editlname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.lname + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Phone (Home): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.primary_phone + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Phone (Cell): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.secondary_phone + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Gender: </p>';
		editinfo+='            </label>';
		editinfo+='            <select class = "form-control col-sm-4" name = "gender" id = "editgender">';
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
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Date of Birth: </p>';
		editinfo+='            </label>';
  		editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" value = "' + String(user_info.user.birth_date).substring(0, 10).replace(/-/g, "\/") + '">';
  		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Address: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "address" id = "editaddress" pattern="^[a-zA-Z0-9._ ]*$" value = "' + user_info.user.address + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Postal Code: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="A1A1A1" pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" value = "' + user_info.user.postal_code + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Apt/Unit #: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "number" class = "form-control" name = "apt" id = "apt" value = "' + user_info.user.unit_no + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>City: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control" name = "city" id = "city" pattern="[a-zA-Z. ]+">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-12">';
		editinfo+='            <label class="fieldname col-sm-4">';
		editinfo+='                <p>Province: </p>';
		editinfo+='            </label>';
		editinfo+='            <select class = "form-control col-sm-4" name = "gender" id = "editprovince">';
		editinfo+='                <option value="" disabled selected>Please Select</option>';
		for (var i = 0; i < user_info.provinces_list.length; i++) {
			editinfo+='                <option value="user_info.provinces_list[i].province_id">' + user_info.provinces_list[i].province_name + '</option>';	
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
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Grade/Year: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
			editinfo+='    	  </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>ESL Level: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		else{
			editinfo+='    <hr>';
			editinfo+='    <h3>Student Information</h3>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Grade: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='    	  </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
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
			editinfo+='<div id = "contact' + (i+1) + '">';
			editinfo+='    <h4>Contact #'+(i+1)+':</h4>';
			editinfo+='    <div class="row" id = "contact' + (i+1) + '">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
        	editinfo+='            <input type = "text" class = "form-control" name = "emergencyfname' + (i+1) + '"  id = "emergencyfname' + (i+1) + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].fname + '" required>';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Last Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "emergencylname' + (i+1) + '"  id = "emergencylname' + (i+1) + '"  placeholder="" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].lname + '" required>';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name =  "relationship' + (i+1) + '" id = "relationship' + (i+1) + '" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].relationship + '" required>';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Phone: </p>';
			editinfo+='            </label>';
        	editinfo+='            <input type = "text" class = "form-control" name =  "ephone' + (i+1) + '" id = "ephone' + (i+1) + '" maxlength="16" pattern="\w+" value = "' + user_info.emergency_contacts[i].contact_phone + '" required>';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='</div>';
		}
		// Forms for not-yet-created emergency contacts
		for (var i = user_info.emergency_contacts.length+1; i<=3; i++) {
	        editinfo+='<div id = "contact' + i + '" class = "hidden">';
	        editinfo+='    <h4>Contact #'+ i +':</h4>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "emergencyfname' + i + '"  id = "emergencyfname' + i + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Last Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name = "emergencylname' + i + '"  id = "emergencylname' + i + '"  placeholder="" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name =  "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-12">';
			editinfo+='            <label class="fieldname col-sm-4">';
			editinfo+='                <p>Phone: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control" name =  "ephone' + i + '" id = "ephone' + i + '" maxlength="16" pattern="\w+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='</div>';
		}
		// Add and remove contacts buttons
		editinfo+='<div class="row">';
		editinfo+='    <div class = "form-group col-sm-12 smallmargin">';
		editinfo+='        <button type = "button" class= "btn btn-default" onclick="addcontact()" id = "addbutton">Add another contact</button>';
		editinfo+='        <button type = "button" class= "btn btn-default';
		if (user_info.emergency_contacts.length == 1) {
			editinfo+=' hidden';
		}
		editinfo+='" onclick="removecontact()" id = "removebutton">Remove a contact</button>';
		editinfo+='    </div>';
		editinfo+='</div>';
		editinfo+='<hr>';
		editinfo+='<div class="row form-group col-sm-12">';
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
				postal_code: $('#postal_code').val(),		////////////////////////////////////////////////////////////////// doesn't work
				city: $('#city').val(),						////////////////////////////////////////////////////////////////// doesn't work
				unit_no: $('#apt').val(),					////////////////////////////////////////////////////////////////// doesn't work
															////////////////////////////////////////////////////////////////// province
				schoolname: $('#editschoolname').val(),
				grade: $('#editgrade').val(),
				major: $('#editmajor').val(),
				esl: $('#editesl').val()
															////////////////////////////////////////////////////////////////// emergency contacts
		})
		.done(function (res){
			swal({
				title: "Profile updated.",
				type: "success"
			});
			load_profile();
		})
		.fail(function (err){
			swal({
				title: "Failed to save changes.", 
				type: "error"
			});
		});
		window.onbeforeunload = null;
		setTimeout(function(){
	    	$("html, body").animate({ scrollTop: 0 }, "slow");
		}, 300);
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

var preventUser = function() {
    return "Your work will be lost";
}

//Display list of registerable courses
function listcourses(){
	jQuery.getJSON("/user/profile/courses", function(data){

		$('#courses').contents().remove();

		var courses = '';
		courses += '<div id="scheduleaccordion" class="panel-group">';
		for(i = 0; i < data.length; i++) {
			courses += '    <div class="panel panel-primary">';
			courses += '        <div class="panel-heading">';
			courses += '            <h4 class="panel-title">';
			courses += '                <a aria-expanded="false" class="collapsed" data-toggle="collapse" href="#collapse' + i + '">';
			courses += '                    <div class="row">';
			courses += '                        <div class="col-sm-5">' + data[i].course_name +'</div>';
			courses += '                        <div class="col-sm-7 righttext">Course Code: ' + data[i].course_code + '</div>';
			courses += '                    </div>';
			courses += '                </a>';
			courses += '            </h4>';
			courses += '        </div>';
			courses += '        <div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="collapse' + i + '">';
			courses += '          	<div class="panel-body">';
			courses += '        	<div class="col-sm-offset-1">';
			courses += '        		<div class="row">';
			courses += '            		<div class="form-group col-sm-12">';
			courses += '                		<p id="description' + i + '">' + data[i].course_description + '</p>';
			courses += '        			</div>';
			courses += '        		</div>';
			courses += '        		<div class="row">';
			courses += '            		<div class="col-sm-6">';
			courses += '               		 	 <p id="coursestartdate' + i + '">Start Date: ' + String(data[i].start_date).substring(0, 10) + '</p>';
			courses += '            		</div>';
			courses += '            		<div class="col-sm-6">';
			courses += '                		  <p id="courseenddate' + i + '">End Date: ' + String(data[i].end_date).substring(0, 10) + '</p>';
			courses += '            		</div>';
			courses += '        		</div>';
			courses += '        		<div class="row">';
			courses += '            		<div class="col-sm-6">';
			courses += '                		<p id="coursetime' + i + '">Time: ' + data[i].course_time + '</p>';
			courses += '            		</div>';
			courses += '            		<div class="col-sm-6">';
			courses += '                  		<p id="courseinterval' + i + '">Interval: ' + data[i].course_interval + '</p>';
			courses += '           			</div>';
			courses += '        		</div>';
			courses += '        		<div class="row">';
			//remove comment once target is linked
			//courses += '        	    	<div class="col-sm-6">';
			//courses += '        	        	 <p id="coursetarget' + i + '">Target: ' + data[i].course_target + '</p>';
			//courses += '         	   		</div>';
			courses += '          	  		<div class="col-sm-6">';
			courses += '         	         	<p id="cost' + i + '">Cost: ' + data[i].default_fee + '</p>';
			courses += '        	    	</div>';
			courses += '        		</div>';
			courses += '        		<div class="row">';
			courses += '            		<div class="col-sm-6">';
			courses += '            			<button type="submit" action="/register" class="btn btn-default course-submit" onclick="register(this)" method="POST" id="submit" value="' +data[i].course_id +'">Add to Cart</button>';
			courses += '            		</div>';
			courses += '       			</div>';
			courses += '        	</div>';
			courses += '        	</div>';
			courses += '        </div>';
			courses += '    </div>';
		}
		schedule += '</div>';
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
			username: res[0].username,
			password: $('#password').val(),
			_csrf: $('#_csrf').val()
		});
	});
}
