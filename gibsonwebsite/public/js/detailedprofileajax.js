function editpersonal (){
	var username = $('#username').text();
	var email = $('#email').text();
	var fname = $('#fname').text();
	var lname = $('#lname').text();
	var primary_phone = $('#primary_phone').text();
	var secondary_phone = $('#secondary_phone').text();
	var gender = $('#gender').text();
	var birth_date = '';
	var address = $('#address').text();
	var unit_no = $('#unit_no').text();
	var city = $('#city').text();

	$('#profile').contents().remove();
	var editpersonal='';
	editpersonal+='    <hr>';
	editpersonal+='    <h1>Basic Information</h1>';
	editpersonal+='    <form class="form-inline" name="editinformation" id="editinformation" action="/user/profile/edit" method="POST" role="form">';
	editpersonal+='    <input type = "hidden" name="_csrf" value="'+ $('#_csrf').val() +'">';
	editpersonal+='    <input type="hidden" name="username" id="username" value="' + username + '">';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Username: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <p id = "displayusername" class="editinfotext">' + username + '</p>';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='			   <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Email: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <p id = "displayemail" class="editinfotext">' + email + '</p>';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>First Name: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "fname" id = "editfname" required pattern="[a-zA-Z0-9. ]+" value = "' + fname + '">';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='			   <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Last Name: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "lname" id = "editlname" required pattern="[a-zA-Z0-9. ]+" value = "' + lname + '">';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Phone (Home): </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input class = "form-control col-sm-4" type = "text" name = "primary_phone" id = "editprimary_phone" maxlength="16" pattern="\\w+" value = "' + primary_phone + '">';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Phone (Cell): </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input class = "form-control col-sm-4" type = "text" name = "secondary_phone" id = "editsecondary_phone" maxlength="16" pattern="\\w+" value = "' + secondary_phone + '">';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Gender: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <select class = "form-control col-sm-4 editselect" name = "gender" id = "editgender">';
	editpersonal+='                <option ';
	if (gender == "Male") { editpersonal+= 'selected '; }
	editpersonal+='value = "Male">Male</option>';
	editpersonal+='                <option ';
	if (gender == "Female") { editpersonal+= 'selected '; }
	editpersonal+='value = "Female">Female</option>';
	editpersonal+='                <option ';
	if (gender == "Other") { editpersonal+= 'selected '; }
	editpersonal+='value = "Other">Other</option>';
	editpersonal+='            </select>';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Date of Birth: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type="text" class = "form-control datepicker" name="birth_date" id = "datepicker" placeholder="YYYY/MM/DD" data-date-end-date="0d" value = "' + String(birth_date).substring(0, 10).replace(/-/g, "\/") + '">';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Address: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "address" id = "editaddress" pattern="^[a-zA-Z0-9._ ]*$" value = "' + address + '">';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Postal Code: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="A1A1A1" pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" value = "' + user_info.user.postal_code + '">';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Apt/Unit #: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "number" class = "form-control col-sm-4" name = "apt" id = "apt" value = "' + unit_no + '">';
	editpersonal+='        </div>';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>City: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "city" id = "city" pattern="[a-zA-Z. ]+" value = "' + city + '">';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	editpersonal+='    <div class="row">';
	editpersonal+='        <div class="form-group col-sm-5">';
	editpersonal+='            <label class="editfieldname col-sm-5">';
	editpersonal+='                <p>Province: </p>';
	editpersonal+='            </label>';
	editpersonal+='            <select class = "form-control col-sm-4 editselect" name = "editprovince" id = "editprovince">';
	// for (var i = 0; i < user_info.provinces_list.length; i++) {
	// 	//editpersonal+='                <option value="user_info.provinces_list[i].province_id"';
	// 	editpersonal+='                <option';
	// 	if (user_info.user.prov_abb == user_info.provinces_list[i].prov_abb) {
	// 		editpersonal+=' selected';
	// 	}
	// 	editpersonal+='>' + user_info.provinces_list[i].prov_abb + '</option>';
	// }
	editpersonal+='            </select>';
	editpersonal+='        </div>';
	editpersonal+='    </div>';
	$('#profile').append(editinfo);
}

function editstudent (){
	
}

function editcontacts () {
	var username = $('#username').text();
	var email = $('#email').text();
	var fname = $('#fname').text();
	var lname = $('#lname').text();
	var primary_phone = $('#primary_phone').text();
	var secondary_phone = $('#secondary_phone').text();
	var gender = $('#gender').text();
	var birth_date = '';
	var address = $('#address').text();
	var unit_no = $('#unit_no').text();
	var city = $('#city').text();
	
	$('#profile').contents().remove();
	var editinfo='';
	
	//check if user is a student
	if(user_info.user.student==1)
	{
		editpersonal+='    <hr>';
		editpersonal+='    <h1>Student Information</h1>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>School Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.school_name + '">';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Grade/Year: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.grade + '">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Major: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.major + '">';
		editpersonal+='    	  </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>ESL Level: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.student_info.esl_level + '">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
	}
	else {
		editpersonal+='    <hr>';
		editpersonal+='    <h1>Student Information</h1>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>School Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "schoolname" id = "editschoolname" pattern="[a-zA-Z0-9. ]+" value = "">';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Grade: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "grade" id = "editgrade" pattern="[a-zA-Z0-9. ]+" value = "">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Major: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "major" id = "editmajor" pattern="[a-zA-Z0-9. ]+" value = "">';
		editpersonal+='    	  </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>ESL Level: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "esl" id = "editesl" pattern="[a-zA-Z0-9. ]+" value = "">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
	}
	editpersonal+='    <hr>';
	editpersonal+='    <h1>Emergency Contacts</h1>';
	// The user's existing emergency contacts
	for(var i=0; i<user_info.emergency_contacts.length; i++)
	{
		editpersonal+='<div id = "contact' + (i+1) + '" class = "ECdisplay">';
		editpersonal+='    <h4>Contact #'+(i+1)+':</h4>';
		editpersonal+='    <div class="row" id = "contact' + (i+1) + '">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>First Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + (i+1) + '"  id = "emergencyfname' + (i+1) + '" placeholder= "" pattern= "[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].fname + '" >';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Last Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + (i+1) + '"  id = "emergencylname' + (i+1) + '" placeholder="" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].lname + '" >';
		editpersonal+='        </div>';
		// No delete button for the first contact
		if (i != 0) {
			editpersonal+='        <button type = "button" class= "btn btn-danger" id = "delete' + (i+1) + '" onclick="deletecontact(' + (i+1) +')">Delete</button>';
		}
		editpersonal+='    </div>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Relationship: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + (i+1) + '" id = "relationship' + (i+1) + '" pattern="[a-zA-Z0-9. ]+" value = "' + user_info.emergency_contacts[i].relationship + '">';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Phone: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name =  "ephone' + (i+1) + '" id = "ephone' + (i+1) + '" maxlength="16" pattern="\w+" value = "' + user_info.emergency_contacts[i].contact_phone + '">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
		editpersonal+='</div>';
	}
	// Forms for not-yet-created emergency contacts
	for (var i = user_info.emergency_contacts.length+1; i<=3; i++) {
        editpersonal+='<div id = "contact' + i + '" class = "hidden">';
        editpersonal+='    <h4>Contact #'+ i +':</h4>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>First Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "emergencyfname' + i + '"  id = "emergencyfname' + i + '"  placeholder= "" pattern= "[a-zA-Z0-9. ]+">';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Last Name: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name = "emergencylname' + i + '"  id = "emergencylname' + i + '"  placeholder="" pattern="[a-zA-Z0-9. ]+">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
		editpersonal+='    <div class="row">';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Relationship: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name =  "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+">';
		editpersonal+='        </div>';
		editpersonal+='        <div class="form-group col-sm-5">';
		editpersonal+='            <label class="editfieldname col-sm-5">';
		editpersonal+='                <p>Phone: </p>';
		editpersonal+='            </label>';
		editpersonal+='            <input type = "text" class = "form-control col-sm-4" name =  "ephone' + i + '" id = "ephone' + i + '" maxlength="16" pattern="\w+">';
		editpersonal+='        </div>';
		editpersonal+='    </div>';
		editpersonal+='</div>';
	}
	// Add and remove contacts buttons
	editpersonal+='<div class="row">';
	editpersonal+='    <div class = "form-group col-sm-12 smallmargin">';
	editpersonal+='        <button type = "button" class = "btn btn-default" onclick="addcontact()" id = "addbutton"';
	// Disables add contact button if user is at max
	if (user_info.emergency_contacts.length == 3)
	{
		editpersonal+=' disabled';
	}
	editpersonal+='>Add another contact</button>';
	editpersonal+='        <button type = "button" class = "btn btn-default';
	if (user_info.emergency_contacts.length == 1) {
		editpersonal+=' hidden';
	}
	editpersonal+='" onclick="removecontact()" id = "removebutton" disabled>Remove a contact</button>';
	editpersonal+='    </div>';
	editpersonal+='</div>';
	editpersonal+='<hr>';

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
	editpersonal+='<div class="row form-group col-sm-12 savechanges">';
	editpersonal+='    <button type="button" class="btn btn-default" onclick="savechanges()">Save Changes</button>';
	editpersonal+='    <button type="button" class="btn btn-default" onclick="returntoprofile()">Return</button>';
	editpersonal+='</div>';
	editpersonal+='</form>';
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
}