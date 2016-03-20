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

		//Gender and Birth Info
		var gender = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Gender: </strong>" + user_info.user.gender + "</p>");
		var dob = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Date of Birth: </strong>" + String(user_info.user.birth_date).substring(0, 10) + "</p>"); // WIP

		 //Address
  		var address = $("<div></div>", {class: "col-sm-6"}).append("<p><strong>Address: </strong>" + user_info.user.address + "</p>");

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
		$('#profile').append($("<hr>"));

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

		//Address
  		$('#profile').append($("<div></div>", {class:"row"}).append(gender, dob));

  		//Date of Birth
		$('#profile').append($("<div></div>", {class:"row"}).append(address));

		//check if user is a student
		if(user_info.user.student==1)
		{
			$('#profile').append($("<hr>"));
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

		$('#profile').append($("<hr>"));

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