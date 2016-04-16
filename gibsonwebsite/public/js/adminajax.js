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

	/*var count = 0;
	var count2=0;
	$('#addcourses').find('input[required]').each(function(){
		if ($.trim($(this).val()).length == 0)
        {
			count++;
			console.log(this.id)
		}
	});
	if (count > 0)
	{
		$("#addcourses").find('#validate').removeAttr('onClick');
	}
	$('#validate').click(function(){
		count = 0;
		count2=0;
		$('#addcourses').find('input[required]').each(function(){
			if ($.trim($(this).val()).length == 0)
        	{
				count++;
				count2++;
				$(this).addClass('enabler');
			}
			if(count>4)
			{
				$("#addcourses").find('#validate').addClass('disabled');
			}
		});
		if (count>4)
		{
			swal("Please fill in all required fields.")
		}
		console.log(count2)
	});
	//$('#addcourses').find('.enabler').on("change",function(){
	$(document).on("change","input.enabler",function(){
		if ($.trim($(this).val()).length > 0)
        {
			count2--;
			$(this).removeClass('enabler');
		}
		console.log(count2)
		if (count2<=4)
		{
			swal("Course can now be submitted.")
			$('#validate').removeClass('disabled');
			$('#validate').attr('onClick', 'validateCourse()');
		}
	});
/*	$('input[required]').focus(function(){
	}).blur(function(){
		if($.trim($(this).val()).length ==0)
		{
			console.log("please fill")
		}
	});*/
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

		var users = '';
		users = '<hr>';

		users += '    <div class="panel-group" id="profileaccordion">';
		users += '	<div class="search-box">';
		users += '		<h3>Newsletter Email Shortcut</h3>';
        users += '      <p>Click the clipboard icon to copy all users who have signed up for newsletters</p>';
		users += ' 		<label> User Emails:  </label>';
		users += '  	<input id="emails" value="">';
		users += '			<button id="getemailbutton" type="button" data-clipboard-target="#emails"> <img src="/img/clippy.svg.png" alt="Copy to clipboard" height="20" width= "20"></button>';
		users += '	</div>';


		for(var i = 0; i < user_info.length; i++) {

			users += '         <div class="panel panel-primary">';
			users += '            <div class="panel-heading">';
			users += '                <h4 class="panel-title">';
			users += '                    <a data-toggle="collapse" href="#usercollapse' + i + '">';
			users += '                        <p>' + user_info[i].fname + ' ' + user_info[i].lname +'</p>';
			users += '                    </a>';
			users += '                </h4>';
			users += '            </div>';
			users += '            <div class="panel-collapse collapse" id="usercollapse' + i + '">';
			users += '               <div class="panel-body">';
			users += '                        <h3>Personal Information</h3>';
			users += '                        <div class = "row">';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>First Name: </strong>' + user_info[i].fname + '</p>';
			users += '                            </div>';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Last Name: </strong>' + user_info[i].lname + '</p>';
			users += '                            </div>';
			users += '                        </div>';
			users += '                        <div class = "row">';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Username: </strong>' + user_info[i].username + '</p>';
			users += '                            </div>';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Email: </strong>' + user_info[i].email + '</p>';
			users += '                            </div>';
			users += '                        </div>';
			users += '                        <div class = "row">';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Phone (Home): </strong>' + user_info[i].primary_phone + '</p>';
			users += '                            </div>';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Phone (Cell): </strong>' + user_info[i].secondary_phone + '</p>';
			users += '                            </div>';
			users += '                        </div>';
			users += '                        <div class = "row">';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Gender: </strong>' + user_info[i].gender + '</p>';
			users += '                            </div>';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Date of Birth: </strong>' + convertdate(String(user_info[i].birth_date).substring(0, 10)) + '</p>';
			users += '                            </div>';
			users += '                        </div>';
			users += '                        <div class = "row">';
			users += '                            <div class = "col-sm-6">';
			users += '                                <p><strong>Address: </strong>' + user_info[i].address + '</p>';
			users += '								  <a href="/profile/'+ user_info[i].username +'" <button type="button" class="btn btn-success"> Detailed User Page</button></a>';
			users += '                            </div>';
			users += '                        </div>';


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

			}[*]/
			//Emergency Contact
			$('#profile').append(emInfo);
			$('#profile').append(eContacts);
			*/

			users += '        	</div>';
			users += '        </div>';
			users += '    </div>';
		}
		users += '    </div>';

		// If there are no users
		if(user_info.length < 1)
		{
			var empty_courses_html = '';
				empty_courses_html+= '<div> Oops! There are no users signed up. </div>';

			users = empty_courses_html;
		}

		$('#profile').append(users);
		var btn = document.getElementById('getemailbutton');
		new Clipboard(btn);
		copyEmails(user_info);
	});
}

function copyEmails(user_info){

	var emailsString = "";

	for(var i = 0; i < user_info.length; i++){
		if(user_info[i].send_notification == 1){
			emailsString += user_info[i].email + ', ';
		}
	}
	emailsString = emailsString.substring(0, emailsString.length - 2);
	document.getElementById("emails").value = emailsString;
}


//Global variables
var allAvailableCourses;
var allTags;
var checkedBoxes = [];

//Generates List of Courses HTML
function listcourses(){
	jQuery.getJSON("/admin/profile/courses", function(data_unfiltered){

		allAvailableCourses = data_unfiltered;
	})
	.done(function(res){
		jQuery.getJSON("/admin/tags", function(tags){
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
	courses += '	<hr>';

	courses += '	<div class="search-box">';
	courses += '		<p><b>Filter Courses</b></p>';
	courses += '		<input class="search-bar" type="text" name="searchText" id="searchText" onkeyup="filterCourses(this.value)" value="' +searchText +'" placeholder="Search..."/>';
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

	for(var i = 0; i < data.length; i++) {


		courses += '    <div class="panel panel-primary">';
		courses += '        <div class="panel-heading">';
		courses += '            <h4 class="panel-title">';
		courses += '                <a data-toggle="collapse" href="#collapse' + i + '" onClick="listEnrolled('+ data[i].course_id +', '+ i +')">';
		courses += '                    <p id = "course_name_id' + i + '">';
		courses += '                        <span class = "coursename">' + data[i].course_name +'</span>';
		courses += '                        <span class = "courseid">Course Code: ' + data[i].course_code + '</span>';
		courses += '                    </p>';
		courses += '                    <p class = "coursecap">' + data[i].enroll_count + '/' + data[i].course_limit + '</p>';
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
		courses += '         	         	<p id="cost' + i + '">$' + data[i].default_fee + '</p>';
		courses += '        	    	</div>';
		courses += '       			</div>';

				//*** List of Users ***//
		courses += '<table class="table table-bordered" id ="course_table'+ i +'" value='+ data[i].course_id +'>';
		courses += '</table>';


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


function listEnrolled(course_id, index){
	// List of registered students
	jQuery.getJSON("/admin/profile/courses/students?course_id="+course_id, function(students){
		var studentslist = '';
			//studentslist+='    <section width = "20%">';

		if(students.length > 0){
			studentslist+='    <thead>';
			studentslist+='        <caption class = "tablecaption"><strong>Enrolled Students</strong></caption>';
			studentslist+='        <tr class = "tableheader">';
			studentslist+='            <th class = "test">Name</th class = "test">';
			studentslist+='            <th class = "test">Username</th class = "test">';
			studentslist+='            <th class = "test">User ID</th class = "test">';
			studentslist+='            <th class = "test">Email</th>';
			studentslist+='        </tr>';
			studentslist+='    </thead>';
			studentslist+='    <tbody>';
			for(var k = 0; k < students.length; k++) {
				studentslist+='        <tr>';
				studentslist+='            <td>' + students[k].fname + ' ' + students[k].lname + '</td>';
				studentslist+='            <td>' + students[k].username + '</td>';
				studentslist+='            <td>' + students[k].user_id + '</td>';
				studentslist+='            <td>' + students[k].email + '</td>';
				studentslist+='        </tr>';
			}
			studentslist+='    </tbody>';

			//Apply to HTML
			$( "#course_table" ).show("slow", function() {
				// Animation complete.
			});
			$("#course_table"+index).contents().remove();
			$("#course_table"+index).append(studentslist);
		}

		else{
			$( "#course_table" ).hide();
		}
	});
}

function courseform(){
	var nav = '';
    nav += '<hr>';
	nav += '<h1>Add A Course</h1>';
	nav += '<ul class="nav nav-tabs">';
	nav += '	<li class="active"><a href="#info-tab" data-toggle="tab">1. Course Information <i class="fa"></i></a></li>';
	nav += '	<li><a href="#instructor-tab" data-toggle="tab">2. Instructor Information <i class="fa"></i></a></li>';
	nav += '	<li><a href="#time-tab" data-toggle="tab">3. Set Course Schedule <i class="fa"></i></a></li>';
	nav += '</ul>';

	var csrfmeta = $("meta[name=_csrf]");
	var addcourses='';
	addcourses+='                <form name="frm" role = "form" id="courseform" onsubmit="validateCourse();return false">';
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
	course_info+='                            <label><span class="required">*</span>Maximum Capacity:</label>';
	course_info+='                            <input type = "number" class = "form-control" name = "course_limit" id = "course_limit" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row" id="language1">';
	course_info+='                        <div class = "form-group col-sm-4">';
	course_info+='                            <label><span class="required">*</span>Offered Language:</label>';
	course_info+='                            <input type = "text" class = "form-control" name = "course_language1" id = "course_language1" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                            <button type = "button" class= "btn btn-default" id = "addlanguage" onClick="nextLanguages()">Add Another Language</button>';
	course_info+='                            <button type = "button" class= "btn btn-default" id = "removelanguage" onClick="removeLanguages()">Remove Language</button>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-8">';
	course_info+='                            <label class = "targetmargin"><span class="required">*</span>Target Audience:</label>';
	course_info+='                            <input type = "text" class = "form-control" name = "addtarget" id = "addtarget" required>';
	course_info+='                        </div>';
	course_info+='                    </div>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-8">';
	course_info+='                            <label><span class="required">*</span>Description:</label>';
	course_info+='                            <textarea class = "form-control" rows = "6" name = "adddescription" id = "adddescription"></textarea>';
	course_info+='                        </div>';
	course_info+='                  	</div>';
	course_info+='                    <div class = "row">';
	course_info+='                        <div class = "form-group col-sm-8">';
	course_info+='                            <label><span class="required">*</span>Notes:</label>';
	course_info+='                            <textarea class = "form-control" rows = "4" name = "course_notes" id = "course_notes"></textarea>';
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
	instructor_info+='					 		 <label><span class="required">*</span>Instructor\'s Username:</label>';
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
	set_date+='                   <div class = "row">';
	set_date+='                    <div class = "form-group col-sm-8">';
	set_date+='                        <label class = "addcoursepadding"><span class="required">*</span>Date:</label><br>';
	//set_date+='                        <label class = "addcoursepadding"><span class="required">*</span>Date:</label><label id="addstartdate-error" id="addenddate-error" class="error" for="addstartdate addenddate"></label><br>';
	//set_date+='<label id="addenddate-error" class="error hidden" for="addenddate">This field is required.</label>';


	set_date+='                        <div class="input-daterange input-group rangedatepicker">';
	set_date+='                            <input type="text" class="input-sm-4 form-control" name="addstartdate" id="addstartdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	set_date+='                            <span class="input-group-addon">to</span>';
	set_date+='                            <input type="text" class="input-sm-4 form-control" name="addenddate" id="addenddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	set_date+='                        </div>';

	set_date+='                        <label id="addstartdate-error" class="error" for="addstartdate"></label>';
	set_date+='                        <label id="addenddate-error" class="error alignparent" for="addenddate"></label>';



	set_date+='                    </div>';
	set_date+='                   </div>';
	set_date+='                    <div class = "row">';
	set_date+='                        <div class = "form-group col-sm-4" required>';
	set_date+='                            <label class="addcoursepadding"><span class="required">*</span>Class Interval:</label><label id="addinterval-error" class="error" for="addinterval"></label><br>';
	set_date+='                            <label class="radio-inline">';
	set_date+='                              <input type="radio" name="addinterval" id="addinterval" value="weekly" checked="checked">Weekly';
	set_date+='                            </label>';
	set_date+='                            <label class="radio-inline">';
	set_date+='                              <input type="radio" name="addinterval" id="addinterval" value="bi-weekly">Bi-Weekly';
	set_date+='                            </label>';
	set_date+='                        </div>';
	set_date+='                    </div>';

	set_date+='                    <div class = "row" name="day0" id="day0">';	//Cannot be delete tag for reference
	set_date+='                        <div>';
	set_date+='                        	<label class="form-group col-sm-4">Course Days:</label>';
	set_date+='                        	<label class="form-group col-sm-2">Start Time:</label>';
	set_date+='                        	<label class="form-group col-sm-2">End Time:</label><br>';
	set_date+='                    	   </div>';
	set_date+='                    </div>';
	set_date+='                    <div class = "row" name="day1" id="day1">';
	set_date+='                        <div class = "form-group col-sm-4" required>';
	set_date+='                        	<select class="form-control" name="day-of-week1" id="day-of-week1">';
	set_date+='								<option value="">Select a day</option>';
	set_date+='								<option value="Monday">Monday</option>';
	set_date+='								<option value="Tuesday">Tuesday</option>';
	set_date+='								<option value="Wednesday">Wednesday</option>';
	set_date+='								<option value="Thursday">Thursday</option>';
	set_date+='								<option value="Friday">Friday</option>';
	set_date+='								<option value="Saturday">Saturday</option>';
	set_date+='								<option value="Sunday">Sunday</option>';
	set_date+='                        	</select>';
	set_date+='                        </div>';
	set_date+='                    	   <div class = "form-group col-sm-2" required>';
	set_date+='								<input type = "text" class = "form-control time_element" name = "starttime1" id = "starttime1" required>';
	set_date+='								<label id="starttime1-error" class="error smalltext" for="starttime1" style="display:none;"></label>';
	set_date+='                        </div>';
	set_date+='                    	   <div class = "form-group col-sm-2" required>';
	set_date+='								<input type = "text" class = "form-control time_element" name = "endtime1" id = "endtime1" required>';
	set_date+='								<label id="endtime1-error" class="error smalltext" for="endtime1" style="display:none;"></label>';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                    <button type = "button" class= "btn btn-default" id = "addschedule" onClick="addTime()">Add a schedule</button>';
	set_date+='                    <button type = "button" class= "btn btn-default" id = "removeschedule" onClick="removeTime()">Remove schedule</button>';
	set_date+='                    <div class = "row" name="adhoc0" id="adhoc0">';
	set_date+='                    	<div>';
	set_date+='							<label class = "form-group col-sm-4">Ad-Hoc Days:</label>';
	set_date+='							<label class = "form-group col-sm-2">Start Time:</label>';
	set_date+='							<label class = "form-group col-sm-2">End Time:</label>';
	set_date+='                    	</div>';
	set_date+='                    </div>';
	set_date+='                   <div class = "row" id="adhoc1">';
	set_date+='                    <div class = "form-group col-sm-4">';
	set_date+='                        <div class="input-daterange input-group rangedatepicker">';
	set_date+='                            <input type="text" class="input-sm-4 form-control" name="adhocstartdate1" id="adhocstartdate1" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                    <div class = "form-group col-sm-2" required>';
	set_date+='						   <input type = "text" class = "form-control time_element" name = "startadhoc1" id = "startadhoc1" required>';
	set_date+='						   <label id="startadhoc1-error" class="error smalltext" for="startadhoc1" style="display:none;"></label>';
	set_date+='                    </div>';
	set_date+='                    <div class = "form-group col-sm-2" required>';
	set_date+='						   <input type = "text" class = "form-control time_element" name = "endadhoc1" id = "endadhoc1" required>';
	set_date+='						   <label id="endadhoc1-error" class="error smalltext" for="endadhoc1" style="display:none;"></label>';
	set_date+='                    </div>';
	set_date+='                    </div>';
	set_date+='                    <button type = "button" class= "btn btn-default" id = "addadhoc" onClick="addAdhocTime()">Add a custom schedule</button>';
	set_date+='                    <button type = "button" class= "btn btn-default" id = "removeadhoc" onClick="removeAdhocTime()">Remove schedule</button>';
	set_date+='                    <div class="row form-group">';
	//addcourses+='                    <br>';
	set_date+='                        <div class = "col-sm-8 reducepadding">';
	set_date+='                            <button type = "submit" class= "btn btn-success" id = "validate">Submit</button>';
	set_date+='                        </div>';
	set_date+='                    </div>';
	set_date+='                </div>';
	set_date+='                </form>';

	//Insert all tabs
	addcourses+=course_info;
	addcourses+=instructor_info;
	addcourses+=set_date;

	//Submit Tab
	addcourses+='				  	 </div>';	//closing tab div

	$('#addcourses').append(nav);
	$('#addcourses').append(addcourses);
	$('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
	$('.time_element').timepicki({start_time: ["12", "00", "PM"]});
	$.validator.setDefaults({
	    ignore: [],
	});
	$.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Invalid symbols."
	);
	$('#courseform').validate({
		rules: {
			addcoursename: {
				required: true,
				minlength: 3,
				maxlength: 40,
			},
			addcoursecode: {
				required: true,
				maxlength: 20
			},
			addcost: {
				required: true,
				number: true
			},
			course_limit: {
				maxlength: 4
			},
			course_language1: {
				required: true,
				maxlength: 20
			},
			addtarget: {
				required: true,
				minlength: 1,
				maxlength: 100
				// sanitize/escape symbols
			},
			adddescription: {
				required: true
				// sanitize
			},
			instructor_name: {
				required: true,
				regex: "^[\\w'. \-]+$", // Alphanumeric and '.- and space
				maxlength: 64
				// also sanitize
			},
			instructor_username: {
				maxlength: 15,
				regex: "^\\w+$"
			},
			instructor_bio: {
				required: true
				// sanitize
			},
			addstartdate: {
				required: true
			},
			addenddate: {
				required: true
			},
			addinterval: {
				required: true
			},
			starttime: {
				required: true
			}
		}
	});
}

//==============================
//ADD/REMOVE Languages
//==============================
//==============================
//reset onpage refresh
var COUNTLANGUAGE=1;

function nextLanguages(){
	console.log("Adding " + COUNTLANGUAGE + " languages.");

	var newLanguage=COUNTLANGUAGE+1;

	var language='';
	language+='                    <div class = "row" id="language' + newLanguage +'" style="display:none;">';
	language+='                        <div class = "form-group col-sm-4">';
	language+='                            <label><span class="required">*</span>Offered Language:</label>';
	language+='                            <input type = "text" class = "form-control" name = "course_language' + newLanguage + '" id = "course_language' + newLanguage + '">';
	language+='                        </div>';
	language+='                    </div>';

	$('#language'+COUNTLANGUAGE).after(language);
	$('#language'+newLanguage).slideToggle();

	// Adds rules to the new language
	$("#course_language" + newLanguage).rules("add", {
		required: true,
		minlength: 1,
		maxlength: 20
	});
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

//==============================
//ADD/REMOVE Scheduled Days
//==============================
//==============================
//reset onpage refresh
var COUNTCOURSEDAYS=1;

function addTime(){
	console.log("Adding " + COUNTCOURSEDAYS + " Course Time.");

	var newCourseDay=COUNTCOURSEDAYS+1;

	var day='';
	day+='                    <div class = "row" name="day'+ newCourseDay +'" id="day'+ newCourseDay +'" style="display:none;">';
	day+='                        <div class = "form-group col-sm-4">';
	day+='                        	<select class="form-control" name="day-of-week'+ newCourseDay +'" id="day-of-week'+ newCourseDay +'" required>';
	day+='								<option value="">Select a day</option>';
	day+='								<option value="Monday">Monday</option>';
	day+='								<option value="Tuesday">Tuesday</option>';
	day+='								<option value="Wednesday">Wednesday</option>';
	day+='								<option value="Thursday">Thursday</option>';
	day+='								<option value="Friday">Friday</option>';
	day+='								<option value="Saturday">Saturday</option>';
	day+='								<option value="Sunday">Sunday</option>';
	day+='                        	</select>';
	day+='                        </div>';
	day+='                    	   <div class = "form-group col-sm-2">';
	day+='								<input type = "text" class = "form-control time_element" name = "starttime'+ newCourseDay + '" id = "starttime'+ newCourseDay +'" required>';
	day+='								<label id="starttime' + newCourseDay + '-error" class="error smalltext" for="starttime' + newCourseDay + '" style="display:none;"></label>';
	day+='                        </div>';
	day+='                    	   <div class = "form-group col-sm-2">';
	day+='								<input type = "text" class = "form-control time_element" name = "endtime'+ newCourseDay +'" id = "endtime'+ newCourseDay +'" required>';
	day+='								<label id="endtime' + newCourseDay + '-error" class="error smalltext" for="endtime' + newCourseDay + '" style="display:none;"></label>';
	day+='                        </div>';
	day+='                    </div>';

	$('#day'+ COUNTCOURSEDAYS).after(day);
	$('#day'+ newCourseDay).slideToggle();
	$('.time_element').timepicki({start_time: ["12", "00", "PM"]});
	COUNTCOURSEDAYS++;
}

function removeTime(){
	if(COUNTCOURSEDAYS > 0){
		console.log("Removing " + COUNTCOURSEDAYS + " Course Time.");
		$('#day'+COUNTCOURSEDAYS).slideToggle(function(){
			$('#day'+COUNTCOURSEDAYS).remove();
			COUNTCOURSEDAYS--;
		});
	}
	else{
		console.log("Cannot Remove Default Time.");
	}
}

//==============================
//ADD/REMOVE Scheduled Days
//==============================
//==============================
//reset onpage refresh
var COUNTADHOCDAYS=1;

function addAdhocTime(){
	console.log("Adding " + COUNTADHOCDAYS + " AD-HOC Course Time.");

	var newAdhocDay=COUNTADHOCDAYS+1;

	var adhoc='';
	adhoc+='                   <div class = "row" id="adhoc'+ newAdhocDay +'" style="display:none;">';
	adhoc+='                    <div class = "form-group col-sm-4">';
	adhoc+='                        <div class="input-daterange input-group rangedatepicker">';
	adhoc+='                            <input type="text" class="input-sm-4 form-control" name="adhocstartdate'+ newAdhocDay +'" id="adhocstartdate'+ newAdhocDay +'" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
	adhoc+='                        </div>';
	adhoc+='                    </div>';
	adhoc+='                    <div class = "form-group col-sm-2" required>';
	adhoc+='						   <input type = "text" class = "form-control time_element" name = "startadhoc'+ newAdhocDay +'" id = "startadhoc'+ newAdhocDay +'" required>';
	adhoc+='						   <label id="startadhoc' + newAdhocDay + '-error" class="error smalltext" for="startadhoc' + newAdhocDay + '" style="display:none;"></label>';
	adhoc+='                    </div>';
	adhoc+='                    <div class = "form-group col-sm-2" required>';
	adhoc+='						   <input type = "text" class = "form-control time_element" name = "endadhoc'+ newAdhocDay +'" id = "endadhoc'+ newAdhocDay +'" required>';
	adhoc+='						   <label id="endadhoc' + newAdhocDay + '-error" class="error smalltext" for="endadhoc' + newAdhocDay + '" style="display:none;"></label>';
	adhoc+='                    </div>';
	adhoc+='                   </div>';

	$('#adhoc'+COUNTADHOCDAYS).after(adhoc);
	$('#adhoc'+newAdhocDay).slideToggle();
	$('.time_element').timepicki({start_time: ["12", "00", "PM"]});
	$('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
	COUNTADHOCDAYS++;
}

function removeAdhocTime(){
	if(COUNTADHOCDAYS > 0){
		console.log("Removing " + COUNTADHOCDAYS + " Course Time.");
		$('#adhoc'+COUNTADHOCDAYS).slideToggle(function(){
			$('#adhoc'+COUNTADHOCDAYS).remove();
			COUNTADHOCDAYS--;
		});
	}
	else{
		console.log("Cannot Remove Default Adhoc Schedule.");
	}
}

function validateCourse(){
	var languages = addLanguages();
	var scheduled_days = addSchedule();
	var adhoc_days = addAdhoc();

	//$("#courseform").slideToggle();
	$.post("/validateCourse",{
		"course_name": $('#addcoursename').val(),
		"course_code": $('#addcoursecode').val(),
		"addcost":$('#addcost').val(),
		"course_limit":$('#course_limit').val(),
		"languages": languages,
		"addtarget": $('#addtarget').val(),
		"adddescription":$('#adddescription').val(),
		"instructor_name":$('#instructor_name').val(),
		"instructor_username":$('#instructor_username').val(),
		"instructor_bio":$('#instructor_bio').val(),
		"addstartdate":$('#addstartdate').val(),
		"addenddate":$('#addenddate').val(),
		"addinterval":$('#addinterval:checked').val(),
		"notes":$('#course_notes').val(),
		"course_days": scheduled_days,
		"adhoc_days": adhoc_days,
		"_csrf": $('#_csrf').val()
	})
	.done(function (res){
		alert(res);
		submitCourse();
	})
	.fail(function (err){
		//$("#courseform").slideToggle();
		console.log(err.responseText);
		alert(err.responseText);
	});
	//$("#courseform").submit();
}

function submitCourse(){
	var languages = addLanguages();
	var scheduled_days = addSchedule();
	var adhoc_days = addAdhoc();

	//console.log(languages);
	//console.log(scheduled_days);
	//console.log(adhoc_days);

	$.post("/admin/profile/addCourse",{
		"addcoursecode":$('#addcoursecode').val(),
		"addcoursename":$('#addcoursename').val(),
		"addcost":$('#addcost').val(),
		"course_limit":$('#course_limit').val(),
		"languages": languages,
		"addtarget": $('#addtarget').val(),
		"adddescription":$('#adddescription').val(),
		"instructor_name":$('#instructor_name').val(),
		"instructor_username":$('#instructor_username').val(),
		"instructor_bio":$('#instructor_bio').val(),
		"addstartdate":$('#addstartdate').val(),
		"addenddate":$('#addenddate').val(),
		"addinterval":$('#addinterval:checked').val(),
		"notes":$( '#course_notes' ).val(),
		"course_days": scheduled_days,
		"adhoc_days": adhoc_days,
		"_csrf": $('#_csrf').val()
	})
	.done(function (res){
		alert(res);
	});
}

//-----------------------------------------------
//-------Intermediate JSON Creator Functions-----
//-------/AddCourses-----------------------------
//-----------------------------------------------

function addLanguages(){
	var languages = [];
	for(var i=1; i<=COUNTLANGUAGE; i++){
		languages.push($("#course_language"+i).val());
	}

	return languages;
}

function addSchedule(){
	var scheduled_days = [];

	for(var i=1; i<=COUNTCOURSEDAYS; i++){
		var day_of_week = $('#day-of-week'+i).val();
		var start_time = $('#starttime'+i).val();
		var end_time = $('#endtime'+i).val();

		var day = {
			"day":day_of_week,
			"start_time":start_time,
			"end_time":end_time
		}

		scheduled_days.push(JSON.stringify(day));
	}

	return scheduled_days;
}

function addAdhoc(){
	var adhoc_days = [];

	for(var i=1; i<=COUNTADHOCDAYS; i++){
		var date = $('#adhocstartdate'+i).val();
		var start_time = $('#startadhoc'+i).val();
		var end_time = $('#endadhoc'+i).val();

		var day = {
			"day":date,
			"start_time":start_time,
			"end_time":end_time
		}

		adhoc_days.push(JSON.stringify(day));
	}

	return adhoc_days;
}
