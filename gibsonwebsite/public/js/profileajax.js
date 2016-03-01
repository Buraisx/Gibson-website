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

$("a[href$='#profile']").click(function(){
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
		var fname = $("<div></div>", {class: "col-sm-6"}).append("<p>First Name: " + user_info[0].fname + "</p>");
		var lname = $("<div></div>", {class: "col-sm-6"}).append("<p>Last Name: " + user_info[0].lname + "</p>");

		//Identifiers
		var username = $("<div></div>", {class: "col-sm-6"}).append("<p>Username: " + user_info[0].username + "</p>");
		var email = $("<div></div>", {class: "col-sm-6"}).append("<p>Email: " + user_info[0].email + "</p>");

		//Phone
		var primaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p>Phone (Home): " + user_info[0].primary_phone + "</p>");
		var secondaryPhone = $("<div></div>", {class: "col-sm-6"}).append("<p>Phone (Cell): " + user_info[0].secondary_phone + "</p>");

		//Birth Info
		var gender = $("<div></div>", {class: "col-sm-6"}).append("<p>Gender: " + user_info[0].gender + "</p>");
		var dob = $("<div></div>", {class: "col-sm-6"}).append("<p>Date of Birth: " + user_info[0].birth_date + "</p>");

		//Address
		var address = $("<div></div>", {class: "col-sm-6"}).append("<p>Address: " + user_info[0].address + "</p>");

		//Student Info
		var student = $("<div></div>", {class: "col-sm-6"}).append("<p>Student Info: </p>");

		//Emergency Contacts Header
		var emInfo = $("<h3></h3>").append("Emergency Contacts");

		//===================================
		//Place holder for Emergency Contacts
		//===================================
		var eContacts = $("<p></p>").append("[*Insert EJS code here]");
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

		//Add Emergency Contacts
		var addContacts = $("<div></div>", {class:"row form-group"}).append(
			$("<button></button>", {type: "button", class: "btn btn-default col-sm-2", onclick: "", id: "addcontact"}).append(
				"Add Emergency Contact"));

		//Edit Info
		var editInfo = $("<div></div>", {class:"row form-group"}).append(
			$("<button></button>", {type: "button", class: "btn btn-default col-sm-2", onclick: "", id : "editinfo"}).append(
				"Edit Information"));

		//===============
		//Change Password 
		var changePassword = $("<div></div>", {class:"row form-group"}).append(
			$("<button></button>", {type : "button", class: "btn btn-default col-sm-2", onclick:"togglepassworddropdown()", id : "changepassbutton"}).append(
				"Change Password"));

		//Only client Can change Pass
		var cpHidden = $("<div></div>", {id:'change_password', class:'hidden changepassdesign'});
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
		//Phone (Home, Cell)
		$('#profile').append($("<div></div>", {class:"row"}).append(
			primaryPhone, secondaryPhone));
		//Gender and Date of Birth
		$('#profile').append($("<div></div>", {class:"row"}).append(
			gender, dob));
		//Address and Student Info
		$('#profile').append($("<div></div>", {class:"row"}).append(
			address, student));
		//Emergency Contact
		$('#profile').append(emInfo);
		$('#profile').append(eContacts);
		//Add E-Contacts, Edit Info
		$('#profile').append(addContacts);
		$('#profile').append(editInfo);

		//===============
		//Change Password
		$('#profile').append(changePassword);
		$('#profile').append(cpHidden);
		cpHidden.append($("<div></div>", {class:"row"}).append(
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
});


$("a[href$='#courses']").click(function() {
	jQuery.getJSON("/user/profile/courses", function(data){
		
		$('#courses').contents().remove();
		
		var courses = $("<div></div>", {class: "panel-group", id: "accordion"});

		for(i = 0; i < data.length; i++){
			//A Course Accordion Panel
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
										 		coursecost),			//escaping closures
										 	$("<div></div>", {class:"form-group col-sm-6"}).append(
										 		button)));			//escaping closures

			
			courses.append(panel_default);
		}

		$('#courses').append(courses);
	});
});


