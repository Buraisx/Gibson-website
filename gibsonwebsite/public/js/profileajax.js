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
	var nav = '';
	nav += '<hr>';
	nav += '<div class="col-sm-4">';
	nav += '	<div id="sidebar-wrapper">';
	nav += '	<br>';
	nav += '	<br>';
    nav += '        <ul class="sidebar-nav nav-stacked" id="menu">';
    nav += '        <li class="active"><a class="menucolour" href="#personalinfo" data-toggle="tab"><i class="fa fa-user"></i> Personal Information</a></li>';
    if(user_info.user.student==1)
    {
        nav += '        <li><a class="menucolour" href="#studentinfo" data-toggle="tab"><i class="fa fa-graduation-cap"></i> Student Information</a></li>';
    }
    nav += '        <li><a class="menucolour" href="#emergencyinfo" data-toggle="tab"><i class="fa fa-users"></i> Emergency Contacts</a></li>';
    nav += '        <li><a class="menucolour" href="#changepass" data-toggle="tab"><i class="fa fa-key"></i> Change Password</a></li>';
	// Edit Info temporarily disabled
	// nav += '        <li><a class="menucolour" href="#editinfo" data-toggle="tab"><i class="fa fa-pencil"></i> Edit Information</a>';
    nav += '        </li>';
    nav += '    </ul>';
    nav += '	</div>';
    nav += '</div>';

    var profileinfo='';
    profileinfo+='		<div class="tab-content">';

    //profile info tab
	var personalinfo = '';
    personalinfo+='	   <div class="tab-pane active" id="personalinfo">';
    personalinfo+='    <div id="page-content-wrapper" class="container-fluid xyz">';
    personalinfo+='    <div class="row">';
    personalinfo+='        <h3 class="col-sm-8">Personal Information <button id="editpersonalinfo" class="btn btn-default editinfobutton" type="button" onclick="editpersonalinfo()">Edit</button></h3>';
    personalinfo+='    </div>';
    personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Username</span><span class="col-sm-9 fieldval">' + user_info.user.username + '</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
    personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Name</span><span class="col-sm-9 fieldval">' + user_info.user.fname + " " + user_info.user.lname +'</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
	personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Email</span><span class="col-sm-9 fieldval">' + user_info.user.email + '</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
	//Checks if phone number exist
	if(user_info.user.primary_phone||user_info.user.secondary_phone)
	{
		if(user_info.user.primary_phone&&user_info.user.secondary_phone)
		{
		personalinfo+='    <div class="row">';
		personalinfo+='        <div class="form-group col-sm-12">';
		personalinfo+='            <p><span class="col-sm-3 fieldname">Phone (Home)</span><span class="col-sm-9 fieldval">' + user_info.user.primary_phone + '</span></p>';
		personalinfo+='        </div>';
		personalinfo+='    </div>';
		personalinfo+='    <div class="row">';
		personalinfo+='        <div class="form-group col-sm-12">';
		personalinfo+='            <p><span class="col-sm-3 fieldname">Phone (Cell)</span><span class="col-sm-9 fieldval">' + user_info.user.secondary_phone + '</span></p>';
		personalinfo+='        </div>';
		personalinfo+='    </div>';
		}
		else if(user_info.user.primary_phone)
		{
		personalinfo+='    <div class="row">';
		personalinfo+='        <div class="form-group col-sm-12">';
		personalinfo+='            <p><span class="col-sm-3 fieldname">Phone (Home)</span><span class="col-sm-9 fieldval">' + user_info.user.primary_phone + '</span></p>';
		personalinfo+='        </div>';
		personalinfo+='    </div>';
		}
		else
		{
		personalinfo+='    <div class="row">';
		personalinfo+='        <div class="form-group col-sm-12">';
		personalinfo+='            <p><span class="col-sm-3 fieldname">Phone (Cell)</span><span class="col-sm-9 fieldval">' + user_info.user.secondary_phone + '</span></p>';
		personalinfo+='        </div>';
		personalinfo+='    </div>';
		}
	}
	personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Gender</span><span class="col-sm-9 fieldval">' + user_info.user.gender + '</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
	personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Date of Birth</span><span class="col-sm-9 fieldval">' + convertdate(String(user_info.user.birth_date).substring(0, 10)) + '</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
	personalinfo+='    <div class="row">';
	personalinfo+='        <div class="form-group col-sm-12">';
	personalinfo+='            <p><span class="col-sm-3 fieldname">Address</span><span class="col-sm-9 fieldval">' + user_info.user.address + '</span></p>';
    personalinfo+='            <p><span class="col-sm-3 fieldname"></span><span class="col-sm-9 fieldval">' + user_info.user.city + ", " + user_info.user.prov_abb + ", " + user_info.user.postal_code+ '</span></p>';
	personalinfo+='        </div>';
	personalinfo+='    </div>';
	if (user_info.user.unit_no != "") {
		personalinfo+='    <div class="row">';
		personalinfo+='        <div class="form-group col-sm-12">';
		personalinfo+='            <p><span class="col-sm-3 fieldname">Apt/Unit #</span><span class="col-sm-9 fieldval">' + user_info.user.unit_no + '</span></p>';
		personalinfo+='        </div>';
		personalinfo+='    </div>';
	}
    personalinfo +='        </div>';
    personalinfo +='    </div>';

	//student Info Tab
	var studentinfo = '';
    if(user_info.user.student==1)
	{
		studentinfo+='	  <div class="tab-pane" id="studentinfo">';
		studentinfo+='	  <div id="page-content-wrapper" class="container-fluid xyz">';
		studentinfo+='    <h3>Student Information <button id="editstudentinfo" class="btn btn-default editinfobutton" type="button" onclick="editstudentinfo()">Edit</button></h3>';
		studentinfo+='    <div class="row">';
		studentinfo+='        <div class="form-group col-sm-12">';
		studentinfo+='            <p><span class="col-sm-3 fieldname">School Name</span><span class="col-sm-9 fieldval">' + user_info.student_info.school_name + '</span></p>';
		studentinfo+='        </div>';
		studentinfo+='    </div>';
		studentinfo+='    <div class="row">';
		studentinfo+='        <div class="form-group col-sm-12">';
		studentinfo+='            <p><span class="col-sm-3 fieldname">Grade/Year</span><span class="col-sm-9 fieldval">' + user_info.student_info.grade + '</span></p>';
		studentinfo+='        </div>';
		studentinfo+='    </div>';
		if(user_info.student_info.major||user_info.student_info.esl_level)
		{
			if(user_info.student_info.major&&user_info.student_info.esl_level)
			{
				studentinfo+='    <div class="row">';
				studentinfo+='        <div class="form-group col-sm-12">';
				studentinfo+='            <p><span class="col-sm-3 fieldname">Major</span><span class="col-sm-9 fieldval">' + user_info.student_info.major + '</span></p>';
				studentinfo+='    	  </div>';
				studentinfo+='    </div>';
				studentinfo+='    <div class="row">';
				studentinfo+='        <div class="form-group col-sm-12">';
				studentinfo+='            <p><span class="col-sm-3 fieldname">ESL Level</span><span class="col-sm-9 fieldval">' + user_info.student_info.esl_level + '</span></p>';
				studentinfo+='        </div>';
				studentinfo+='    </div>';
			}
			else if(user_info.student_info.major)
			{
				studentinfo+='  <div class="row">';
				studentinfo+='      <div class="form-group col-sm-12">';
				studentinfo+='           <p><span class="col-sm-3 fieldname">Major</span><span class="col-sm-9 fieldval">' + user_info.student_info.major + '</span></p>';
				studentinfo+='      </div>';
				studentinfo+='  </div>';
			}
			else
			{
				studentinfo+='  <div class="row">';
				studentinfo+='      <div class="form-group col-sm-12">';
				studentinfo+='           <p><span class="col-sm-3 fieldname">ESL Level</span><span class="col-sm-9 fieldval">' + user_info.student_info.esl_level + '</span></p>';
				studentinfo+='      </div>';
				studentinfo+='  </div>';
			}
		}
		studentinfo+='    </div> <!-- tab-pane -->';
		studentinfo+='  </div> <!-- container-fluid -->';
	}

	//emergency Info Tab
	var emergencyinfo='';
	emergencyinfo+='	  <div class="tab-pane" id="emergencyinfo">';
	emergencyinfo+='	  <div id="page-content-wrapper" class="container-fluid xyz">';
	emergencyinfo+='      <h3>Emergency Contacts <button id="editcontactsinfo" class="btn btn-default editinfobutton" type="button" onclick="editcontactsinfo()">Edit</button></h3>';
	for(var i=0; i<user_info.emergency_contacts.length; i++)
	{
		emergencyinfo+='    <h4>Contact #'+(i+1)+'</h4>';
		emergencyinfo+='    <div class="row">';
		emergencyinfo+='        <div class="form-group col-sm-12">';
		emergencyinfo+='            <p><span class="col-sm-3 fieldname">Name</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].fname + " " + user_info.emergency_contacts[i].lname + '</span></p>';
		emergencyinfo+='        </div>';
		emergencyinfo+='    </div>';
		emergencyinfo+='    <div class="row">';
		emergencyinfo+='        <div class="form-group col-sm-12">';
		emergencyinfo+='            <p><span class="col-sm-3 fieldname">Relationship</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].relationship + '</span></p>';
		emergencyinfo+='        </div>';
		emergencyinfo+='    </div>';
		emergencyinfo+='    <div class="row">';
		emergencyinfo+='        <div class="form-group col-sm-12">';
		emergencyinfo+='            <p><span class="col-sm-3 fieldname">Phone</span><span class="col-sm-9 fieldval">' + user_info.emergency_contacts[i].contact_phone + '</span></p>';
		emergencyinfo+='        </div>';
		emergencyinfo+='    </div>';
	}
	emergencyinfo+='    </div>';
	emergencyinfo+='    </div>';

	//Change password tab
	var changePassword = '';
	changePassword+='<div class="tab-pane" id="changepass">';
	changePassword+='<div id="page-content-wrapper" class="container-fluid xyz">';
	changePassword+='<div class="changepassdesign form-group form-group-sm row col-sm-12" id="change_password">';
	changePassword+='    <div>';
	changePassword+='        <p class="small">Passwords must contain at least one letter, one number and must have a minimum of 6 characters. No special characters.</p>';
	changePassword+='        <form role="form" method="post" action="/user/profile/changepassword" class="form-inline" id = "change_password_form" onsubmit="changepassword();return false">';
	changePassword+='            <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
	changePassword+='       <div class="row">';
	changePassword+='           <div class="col-sm-6">';
	changePassword+='                <p class="text-right smallmargin smalltext"><strong>Current Password:</strong></p>';
	changePassword+='           </div>';
	changePassword+='           <div class="pull-left">';
	changePassword+='                <input type="password" pattern="\\w+" placeholder="Enter Current Password" id="currentpass" name="currentpass" class="form-control">';
	changePassword+='           </div>';
	changePassword+='       </div>';
	changePassword+='       <div class="row">';
	changePassword+='           <div class="col-sm-6">';
	changePassword+='                <p class="text-right smallmargin smalltext"><strong>New Password:</strong></p>';
	changePassword+='           </div>';
	changePassword+='           <div class="pull-left">';
	changePassword+='                <input onkeyup="checkPass(); return false;" minlength="6" placeholder="Enter New Password" id="password" name="newpass" class="form-control" type="password">';
	changePassword+='           </div>';
	changePassword+='       </div>';
	changePassword+='       <div class="row">';
	changePassword+='           <div class="col-sm-6">';
	changePassword+='                <p class="text-right smallmargin smalltext"><strong>Confirm New Password:</strong></p>';
	changePassword+='           </div>';
	changePassword+='           <div class="pull-left">';
	changePassword+='                <input minlength="6" onkeyup="checkPass(); return false;" placeholder="Confirm New Password" id="passwordhashed" name="confirmnewpass" class="form-control" type="password">';
	changePassword+='           </div>';
	changePassword+='       </div>';
	changePassword+='       <div class="row">';
	changePassword+='            	<button id="changepassbutton" class="btn btn-default submitbutton" type="submit">Change</button>';
	changePassword+='       </div>';
	changePassword+='        </form>';
	changePassword+='    </div>';
	changePassword+='</div>';
	changePassword+='</div>';
	changePassword+='</div>';

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

	var editinfo='';
	editinfo+='	  <div class="tab-pane" id="editinfo">';
	editinfo+='	  <div id="page-content-wrapper" class="container-fluid xyz">';
	editinfo+='    <h1>Personal Information</h1>';
	editinfo+='    <form class="form-inline" name="editinformation" id="editinformation" action="/user/profile/edit" method="POST" role="form">';
	editinfo+='    <input type="hidden" name="username" id="username" value="' + user_info.user.username + '">';
	editinfo+='            <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>First Name: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.fname + '">';
	editinfo+='        </div>';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='			   <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Last Name: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "lname" id = "editlname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.lname + '">';
	editinfo+='        </div>';
	editinfo+='    </div>';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Phone (Home): </p>';
	editinfo+='            </label>';
	editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.primary_phone + '">';
	editinfo+='        </div>';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Phone (Cell): </p>';
	editinfo+='            </label>';
	editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.secondary_phone + '">';
	editinfo+='        </div>';
	editinfo+='    </div>';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
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
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Date of Birth: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" value = "' + String(user_info.user.birth_date).substring(0, 10).replace(/-/g, "\/") + '">';
	editinfo+='        </div>';
	editinfo+='    </div>';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Address: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "address" id = "editaddress" pattern="^[a-zA-Z0-9._ ]*$" value = "' + user_info.user.address + '">';
	editinfo+='        </div>';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Postal Code: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="A1A1A1" pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" value = "' + user_info.user.postal_code + '">';
	editinfo+='        </div>';
	editinfo+='    </div>';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>Apt/Unit #: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "number" class = "form-control col-sm-4" name = "apt" id = "apt" value = "' + user_info.user.unit_no + '">';
	editinfo+='        </div>';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
	editinfo+='                <p>City: </p>';
	editinfo+='            </label>';
	editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "city" id = "city" pattern="[a-zA-Z. ]+" value = "' + user_info.user.city + '">';
	editinfo+='        </div>';
	editinfo+='    </div>';
	editinfo+='    <div class="row">';
	editinfo+='        <div class="form-group col-sm-5">';
	editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='    <h1>Student Information</h1>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>School Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Grade/Year: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Major: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
		editinfo+='    	  </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>ESL Level: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
	}
	else {
		editinfo+='    <hr>';
		editinfo+='    <h1>Student Information</h1>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>School Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Grade: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Major: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "">';
		editinfo+='    	  </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>ESL Level: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "">';
		editinfo+='        </div>';
		editinfo+='    </div>';
	}
	editinfo+='    <hr>';
	editinfo+='    <h1>Emergency Contacts</h1>';
	// The user's existing emergency contacts
	for(var i=0; i<user_info.emergency_contacts.length; i++)
	{
		editinfo+='<div id = "contact' + (i+1) + '" class = "ECdisplay">';
		editinfo+='    <h4>Contact #'+(i+1)+':</h4>';
		editinfo+='    <div class="row" id = "contact' + (i+1) + '">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>First Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + (i+1) + '"  id = "emergencyfname' + (i+1) + '" placeholder= "" pattern= "[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].fname + '" >';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Relationship: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + (i+1) + '" id = "relationship' + (i+1) + '" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].relationship + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>First Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + i + '"  id = "emergencyfname' + i + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Last Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + i + '"  id = "emergencylname' + i + '"  placeholder="" pattern="[a-zA-Z0-9. ]+">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Relationship: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
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
	editinfo+='<div class="row form-group col-sm-12 savechanges">';
	editinfo+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
	editinfo+='</div>';
	editinfo+='</div>';
	editinfo+='</div>';

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

	profileinfo+=personalinfo;
	profileinfo+=studentinfo;
	profileinfo+=emergencyinfo;
	profileinfo+=changePassword;
	profileinfo+=editinfo;

	//Submit Tab
	profileinfo+='				  	 </div>';	//closing tab div

    $('#profile').append(nav);
    $('#profile').append(profileinfo);
    //ON JSON APPEND COMPLETE ATTACH FADE IN ANIMATION
	}).done(function(){
    	$( "#sidebar-wrapper" ).tabs({
        	activate: function( event, ui ) {
            	ui.newPanel.hide().fadeIn(500);
        	}
    	});
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
			load_profile();
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

function editpersonalinfo() {
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#personalinfo').contents().remove();
		var editinfo='';
		editinfo+='    <div id="page-content-wrapper" class="container-fluid xyz">';
	    editinfo+='    <div class="row">';
	    editinfo+='        <h3 class="col-sm-8 editinfoheader">Personal Information</h3>';
	    editinfo+='    </div>';
		editinfo+='    <form class="form-inline" name="editinformation" id="editinformation" action="/user/profile/edit" method="POST" role="form">';
		editinfo+='    <input type="hidden" name="username" id="username" value="' + user_info.user.username + '">';
		editinfo+='            <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>First Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.fname + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='			   <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Last Name: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "lname" id = "editlname" required pattern="[a-zA-Z0-9. ]+" value = "' + user_info.user.lname + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Phone (Home): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.primary_phone + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Phone (Cell): </p>';
		editinfo+='            </label>';
		editinfo+='            <input class = "form-control col-sm-4" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" value = "' + user_info.user.secondary_phone + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Date of Birth: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" value = "' + String(user_info.user.birth_date).substring(0, 10).replace(/-/g, "\/") + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Address: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "address" id = "editaddress" pattern="^[a-zA-Z0-9._ ]*$" value = "' + user_info.user.address + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Postal Code: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="A1A1A1" pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" value = "' + user_info.user.postal_code + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>Apt/Unit #: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "number" class = "form-control col-sm-4" name = "apt" id = "apt" value = "' + user_info.user.unit_no + '">';
		editinfo+='        </div>';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
		editinfo+='                <p>City: </p>';
		editinfo+='            </label>';
		editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "city" id = "city" pattern="[a-zA-Z. ]+" value = "' + user_info.user.city + '">';
		editinfo+='        </div>';
		editinfo+='    </div>';
		editinfo+='    <div class="row">';
		editinfo+='        <div class="form-group col-sm-5">';
		editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='    <div class="row form-group col-sm-12 savechanges">';
		editinfo+='        <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='    </div>';
		$('#personalinfo').append(editinfo);
	});
}

function editstudentinfo() {
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#studentinfo').contents().remove();
		var editinfo='';
		editinfo+='	  <div id="page-content-wrapper" class="container-fluid xyz">';
		if(user_info.user.student==1)
		{
		    editinfo+='    <div class="row">';
		    editinfo+='        <h3 class="col-sm-8 editinfoheader">Student Information</h3>';
	    	editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Grade/Year: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
			editinfo+='    	  </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>ESL Level: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		else {
		    editinfo+='    <div class="row">';
		    editinfo+='        <h3 class="col-sm-8 editinfoheader">Student Information</h3>';
	    	editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>School Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Grade: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Major: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='    	  </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>ESL Level: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "">';
			editinfo+='        </div>';
			editinfo+='    </div>';
		}
		editinfo+='    <div class="row form-group col-sm-12 savechanges">';
		editinfo+='        <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='    </div>';
		editinfo+='    </div> <!-- page-content-wrapper -->';
		$('#studentinfo').append(editinfo);
	});
}

function editcontactsinfo() {
	jQuery.getJSON("/user/profile/info", function(user_info){
		$('#emergencyinfo').contents().remove();
		var editinfo='';
		editinfo+='	  <div id="page-content-wrapper" class="container-fluid xyz">';
	    editinfo+='    <div class="row">';
	    editinfo+='        <h3 class="col-sm-8 editinfoheader">Emergency Contacts</h3>';
    	editinfo+='    </div>';
		// The user's existing emergency contacts
		for(var i=0; i<user_info.emergency_contacts.length; i++)
		{
			editinfo+='<div id = "contact' + (i+1) + '" class = "ECdisplay">';
			editinfo+='    <h4>Contact #'+(i+1)+':</h4>';
			editinfo+='    <div class="row" id = "contact' + (i+1) + '">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + (i+1) + '"  id = "emergencyfname' + (i+1) + '" placeholder= "" pattern= "[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].fname + '" >';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
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
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + (i+1) + '" id = "relationship' + (i+1) + '" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].relationship + '">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
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
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>First Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + i + '"  id = "emergencyfname' + i + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Last Name: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + i + '"  id = "emergencylname' + i + '"  placeholder="" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='    </div>';
			editinfo+='    <div class="row">';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
			editinfo+='                <p>Relationship: </p>';
			editinfo+='            </label>';
			editinfo+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+">';
			editinfo+='        </div>';
			editinfo+='        <div class="form-group col-sm-5">';
			editinfo+='            <label class="editfieldname col-sm-12">';
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
		editinfo+='>Add a new contact</button>';
		editinfo+='        <button type = "button" class = "btn btn-default';
		if (user_info.emergency_contacts.length == 1) {
			editinfo+=' hidden';
		}
		editinfo+='" onclick="removecontact()" id = "removebutton" disabled>Remove a new contact</button>';
		editinfo+='    </div>';
		editinfo+='</div>';
		editinfo+='<div class="row form-group col-sm-12 savechanges">';
		editinfo+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
		editinfo+='</div>';
		editinfo+='</div>';
		editinfo+='</div>';
				editinfo+='</div>';

		$('#emergencyinfo').append(editinfo);
	});
}

//Global variables
var allAvailableCourses;
var allTags;
var checkedBoxes = [];

//Display list of registerable courses
function listcourses(){
	jQuery.getJSON("/user/profile/courses", function(data_unfiltered){

		allAvailableCourses = data_unfiltered;
	})
	.done(function(res){
		jQuery.getJSON("/user/tags", function(tags){
			allTags = tags;
			showFilteredCourses(allAvailableCourses, '', []);
		});
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
	var coursesFilteredByTags = [];
	var match = false;

	// FILTERTING COURSES BY TAGS
	if(checkedBoxes.length === 0){
		coursesFilteredByTags = allAvailableCourses;
	}
	else{
		for(var i = 0; i < allAvailableCourses.length; i++){
			for (var j = 0; j < checkedBoxes.length; j++){
				if(allAvailableCourses[i].categories.indexOf(checkedBoxes[j]) != -1){
					coursesFilteredByTags.push(allAvailableCourses[i]);
					break;
				}
			}
		}
	}


	// Very crude word match search
	if (searchTerms.length === 0){
		filteredCourses = coursesFilteredByTags;
	}
	else{
		for (var i = 0; i < coursesFilteredByTags.length; i++){
			for (var j = 0; j < searchTerms.length; j++){
				if(coursesFilteredByTags[i].course_name.toLowerCase().indexOf(searchTerms[j]) > -1 ||
					 coursesFilteredByTags[i].course_description.toLowerCase().indexOf(searchTerms[j]) > -1 ||
					 coursesFilteredByTags[i].notes.toLowerCase().indexOf(searchTerms[j]) > -1 ||
					 coursesFilteredByTags[i].course_language.toLowerCase().indexOf(searchTerms[j]) > -1 ||
				 	 coursesFilteredByTags[i].course_code.toLowerCase().indexOf(searchTerms[j]) > -1 ||
				 	 coursesFilteredByTags[i].course_target.toLowerCase().indexOf(searchTerms[j]) > -1){

					match = true;
				}
				else{
					match = false;
					break;
				}
			}

			if (match){
				filteredCourses.push(coursesFilteredByTags[i]);
			}
		}
	}

	showFilteredCourses(filteredCourses, searchText, checkedBoxes);
}

function updateCheckboxArray(searchText, categoryId){
	var index = checkedBoxes.indexOf(categoryId);

	if(index === -1){ //NOT FOUND -> ADD
		checkedBoxes.push(categoryId);
	}
	else{ //FOUND -> DELETE
		checkedBoxes.splice(index, 1);
	}

	filterCourses(searchText);
}

//Display list of registerable courses
// Actually displaying courses.
function showFilteredCourses(data, searchText, searchTags){

	var checkBoxesHTML = [];
	var isChecked = false;

	// GENERATING HTML FOR CHECKBOXES
	for (var i in allTags){
		isChecked = false;

		for (var j in checkedBoxes){
			if (allTags[i].category_id == checkedBoxes[j]){
				isChecked = true;
				break;
			}
		}

		if (isChecked){
			checkBoxesHTML.push('<div><label><input type="checkbox" onclick="updateCheckboxArray(searchText.value, '+allTags[i].category_id +')" checked=""> ' +allTags[i].category_string +'</label></div>');
		}
		else{
			checkBoxesHTML.push('<div><label><input type="checkbox" onclick="updateCheckboxArray(searchText.value, '+allTags[i].category_id +')"> ' +allTags[i].category_string +'</label></div>');
		}
	}

	$('#courses').contents().remove();

	var courses = '';
	courses += '<div id="coursesaccordion" class="panel-group">';
    courses += '<hr>';
    courses += '<h1>List of Available Courses</h1>';

	courses += '	<div class="search-box">';
	courses += '		<p><b>Filter Courses</b></p>';
	courses += '		<input class="search-bar" type="text" name="searchText" id="searchText" onkeyup="filterCourses(this.value)" placeholder="Search..."/>';
	courses += '		<div class="tag-box">';
	courses += '			<p><b>Filter by Tags</b></p>';
	courses += '			<div class="checkboxes-col-1">';
	for(var i = 0; i < Math.ceil(checkBoxesHTML.length/2); i++){
		courses += checkBoxesHTML[i];
	}
	courses += '			</div>';

	// ALIGN THE CHECKBOXES
	if(checkBoxesHTML.length%2 === 0){ //EVEN
		courses += '			<div style="padding-left: 15px; padding-top: 5px; background-color: #ffffff; margin-left: 240px; margin-top: -' +(129 + 31*Math.ceil((checkBoxesHTML.length-8)/2)) +'px; margin-bottom: 0px;">';
	}
	else{ //ODD
		courses += '			<div style="padding-left: 15px; padding-top: 5px; background-color: #ffffff; margin-left: 240px; margin-top: -' +(129 + 31*Math.ceil((checkBoxesHTML.length-8)/2)) +'px; margin-bottom: 31px;">';
	}

	for(var i = Math.ceil(checkBoxesHTML.length/2); i < checkBoxesHTML.length; i++){
		courses += checkBoxesHTML[i];
	}
	courses += '			</div>';
	courses += '		</div>';
	courses += '	</div>';


	courses += '    <div class="panel-group" id="profileaccordion">';


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

        //*** AJAX for Generating Notes ***//
		courses += '        		<div class="row">';
		courses += '            		<div class="col-sm-4">';
		courses += '                		<p id="descriptiontitle' + i + '"><b>NOTE: </b></p>';
		courses += '        			</div>';
		courses += '            		<div class="col-sm-8">';
        courses += '                		<p id="description' + i + '">' + data[i].notes + '</p>';
		courses += '        			</div>';
		courses += '        		</div>';

        //*** AJAX for Generating Period ***//
		courses += '        		<div class="row largemargin">';
		courses += '            		<div class="col-sm-4">';
		courses += '               		 	 <p id="courseperiodtitle' + i + '"><b>Period:</b></p>';
		courses += '            		</div>';
        courses += '            	   <div class="col-sm-8">';
		courses += '               		 	 <p id="courseperiod' + i + '">' + convertdate(String(data[i].start_date).substring(0, 10)) + ' to ' + convertdate(String(data[i].end_date).substring(0, 10)) + '</p>';
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
                if (j != 0) {
					courses += '            <div class="col-sm-8 col-sm-offset-4">';
                }
                else {
					courses += '            <div class="col-sm-8">';
                }
                courses += '                 <p id="courselanguage' + i + '">' + lang + '</p>';
				courses += '            </div>';
			}
		}
        courses += '                </div>';

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
                if (j != 0) {
				courses += '            <div class="col-sm-8">';
                }
                else {
                courses += '            <div class="col-sm-8">';
                }
                courses += '                 <span class="courseday">' + days + '</span>';
                courses += '                 <span class="coursetime">' + time + '</span>';
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
		courses += '         	         	<p id="cost' + i + '">$' + data[i].default_fee.toFixed(2) + '</p>';
		courses += '        	    	</div>';
		courses += '            		<div class="col-sm-7 addbutton">';
		courses += '            			<button type="button" class="btn btn-default course-submit" onclick="register(this)" id="submit" value="' + data[i].course_id +'">Add to Cart</button>';
		courses += '            		</div>';
		courses += '       			</div>';


        //*** Closes all divs ***//
		courses += '        	</div>';
		courses += '        	</div>';
		courses += '        </div>';
		courses += '    </div>';


	}
	courses += '</div>';
	courses += '</div>';

	$('#courses').append(courses);

	//If there are no courses in search
	if(data.length < 1)
	{
		var empty_courses_html = '';
			empty_courses_html+= '<div>There are currently no courses available.</div>';

		$('#coursesaccordion').append(empty_courses_html);
	}

	$("#searchText").focus();
	$("#searchText").val('');
	$("#searchText").val(searchText);
}




//Show a personal user schedule
function listschedule(){
	jQuery.getJSON("/user/profile/schedule", function(data){
		$('#schedule').contents().remove();
		var schedule = '';
        schedule += '<hr>';
        schedule += '<h1>My Scheduled Courses</h1>';
		schedule += '<div id="scheduleaccordion" class="panel-group">';
        schedule += '<div class="panel-group" id="scheduleaccordion">';
		for(i = 0; i < data.length; i++) {
			schedule += '    <div class="panel panel-primary">';
			schedule += '        <div class="panel-heading">';
			schedule += '            <h4 class="panel-title">';
			schedule += '                <a aria-expanded="false" class="collapsed" data-toggle="collapse" href="#scollapse' + i + '">';
			schedule += '                    <div class="row">';
			schedule += '                        <div class="col-sm-9">' + data[i].course_name +'</div>';
			schedule += '                        <div class="col-sm-3">Course Code: ' + data[i].course_code + '</div>';
			schedule += '                    </div>';
			schedule += '                </a>';
			schedule += '            </h4>';
			schedule += '        </div>';
			schedule += '        <div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="scollapse' + i + '">';
			schedule += '            <div class="panel-body">';
			schedule += '               <div class="col-sm-offset-1">';

            //*** AJAX for Generating Description ***//
            schedule += '        		<div class="row">';
            schedule += '            		<div class="col-sm-4">';
            schedule += '                		<p id="descriptiontitle' + i + '"><b>Description:</b></p>';
            schedule += '        			</div>';
            schedule += '            		<div class="col-sm-8">';
            schedule += '                		<p id="description' + i + '">' + data[i].course_description + '</p>';
            schedule += '        			</div>';
            schedule += '        		</div>';

            //*** AJAX for Generating Notes ***//
            schedule += '        		<div class="row">';
            schedule += '            		<div class="col-sm-4">';
            schedule += '                		<p id="descriptiontitle' + i + '"><b>NOTE: </b></p>';
            schedule += '        			</div>';
            schedule += '            		<div class="col-sm-8">';
            schedule += '                		<p id="description' + i + '">' + data[i].notes + '</p>';
            schedule += '        			</div>';
            schedule += '        		</div>';

            //*** AJAX for Generating Period ***//
            schedule += '        		<div class="row largemargin">';
            schedule += '            		<div class="col-sm-4">';
            schedule += '               		 	 <p id="courseperiodtitle' + i + '"><b>Period:</b></p>';
            schedule += '            		</div>';
            schedule += '            	   <div class="col-sm-8">';
            schedule += '               		 	 <p id="courseperiod' + i + '">' + convertdate(String(data[i].start_date).substring(0, 10)) + ' to ' + convertdate(String(data[i].end_date).substring(0, 10)) + '</p>';
            schedule += '            		</div>'
            schedule += '        		</div>';

            //*** AJAX for Generating Target ***//
            schedule += '        		<div class="row">';
            schedule += '        	    	<div class="col-sm-4">';
            schedule += '        	        	 <p id="coursetargettitle' + i + '"><b>Target:</b></p>';
            schedule += '         	   		</div>';
            schedule += '        	    	<div class="col-sm-8">';
            schedule += '        	        	 <p id="coursetarget' + i + '">' + data[i].course_target + '</p>';
            schedule += '         	   		</div>';
            schedule += '        		</div>';

            //*** AJAX for Generating Language ***//
            schedule += '        		<div class="row">';
            schedule += '        	    	<div class="col-sm-4">';
            schedule += '        	        	 <p id="courselanguagetitle' + i + '"><b>Language:</b></p>';
            schedule += '         	   		</div>';


            //*** JQuery Loop for Generating Languages ***//
            if(data[i].course_language != null){
                for(var j = 0; j < JSON.parse(data[i].course_language).length; j++){
                    var lang = JSON.parse(data[i].course_language)[j];
                    if (j != 0) {
                        schedule += '            <div class="col-sm-8 col-sm-offset-4">';
                    }
                    else {
                        schedule += '            <div class="col-sm-8">';
                    }
                    schedule += '                 <p id="courselanguage' + i + '">' + lang + '</p>';
                    schedule += '            </div>';
                }
            }
            schedule += '                </div>';

            //*** AJAX for Header of Date(s) and Time(s) ***//
            schedule += '        		<div class="row largemargin">';
            schedule += '            		<div class="col-sm-4">';
            schedule += '                		<p id="coursetimetitle' + i + '"><b>Date(s) and Time(s):</b></p>';
            schedule += '            		</div>';

            //*** AJAX Loop for Generating Day-Time ***//
            if(data[i].course_days != null){
                for (var j = 0; j < JSON.parse(data[i].course_days).length; j++ ){
                    var days = JSON.parse(data[i].course_days)[j].day;
                    var time = JSON.parse(data[i].course_days)[j].start_time + "&nbsp" + " - " + "&nbsp;" + JSON.parse(data[i].course_days)[j].end_time;
                    if (j != 0) {
                    	schedule += '            <div class="col-sm-8">';
                    }
                    else {
                    	schedule += '            <div class="col-sm-8">';
                    }
                    schedule += '                 <span class="courseday">' + days + '</span>';
                    schedule += '                 <span class="coursetime">' + time + '</span>';
                    schedule += '            </div>';

                }
            }
            schedule += '        </div>';


			schedule += '               </div>';
            schedule += '               </div>';
			schedule += '            </div>';
			schedule += '        </div>';
		}
		//If there are no courses in search
		if(data.length < 1)
		{
			schedule+= '<div>You have no courses in your schedule. Sign up today using the Courses tab!</div>';
		}
		schedule += '</div>';
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
