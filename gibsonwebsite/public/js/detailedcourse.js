//*** GLOBAL VARIABLES ***//
var TAG_LIST=[];	//LIST OF ALL TAGS 
var COURSE_TAG_LIST=[]; //LIST OF ALL COURSE TAGS
//***********************//

$(function() {
	$( "#tags-sortable" ).sortable({ 
		placeholder: "ui-sortable-placeholder" 
	});
});

$(document).ready(getCourse());

function getCourse() {
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		TAG_LIST = data[1];
		COURSE_TAG_LIST = data[0].categories;

		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories
		//data[1] holds a list of all existing category types
		//data[2] holds list of users enrolled to the course
		//data[3] holds course schedule
		//***//
		updateAutoCompleteList(TAG_LIST);
		updateCourseTagsList(COURSE_TAG_LIST, false);

		//UPDATE THE PAGE DATA
		listEnrolled(data[2]);
		showHeader(data[0].course);
		showDescription(data[0].course);
		showSchedule(data[0].course, data[3]);
		showInstructor(data[0].course);

		//STAFF+ STUFF
		if(getRank() >= 3){
			addEditButtons();
		}
	});
}


//======================================================
//======================================================
//======= COURSE INFO MANAGEMENT =======================
//======================================================
//======================================================
//*** ADD COURSE CODE/NAME HEADER***//
function showHeader(data){
	$("#course-name").text ( data.course_code + " - " + data.course_name);
}
//**********************************

//*** LIST OF ENROLLED USERS ***//
function listEnrolled(data){
	// List of registered students
	var studentslist = '';

	if(data.length){
		studentslist+='    <thead>';
		studentslist+='        <tr class = "tableheader">';
		studentslist+='            <th>Username</th>';
		studentslist+='            <th>Name</th >';
		studentslist+='            <th>Email</th>';
		studentslist+='        </tr>';
		studentslist+='    </thead>';
		studentslist+='    <tbody>';
		for(var k = 0; k < data.length; k++) {
			studentslist+='        <tr>';
			studentslist+='            <td>' + data[k].username + '</td>';
			studentslist+='            <td>' + data[k].fname + ' ' + data[k].lname + '</td>';
			studentslist+='            <td>' + data[k].email + '</td>';
			studentslist+='        </tr>';
		}
		studentslist+='    </tbody>';

		//Apply to HTML
		$("#course-usertable").append(studentslist);
	}

	else{
		$( "#course-enrollment" ).hide();
	}
}
//******************************//

//*** FILL IN COURSE DESCRIPTION ***//
function showDescription(data){
	var languages="";
	var language_set = JSON.parse(data.course_language);

	if(data.default_fee != null && data.default_fee != ""){
		$("#course-desc-cost").text( "Cost: $" + data.default_fee.toFixed(2) );
		$("#course-desc-cost").val( data.default_fee );
	}
		

	if(data.course_target != null && data.course_target != "")
		$("#course-desc-target").text( "Course Target: " + data.course_target );
	
	if(language_set.length){
		for(var i = 0; i < language_set.length; i++){
			languages+=language_set[i] + ", ";
		}
		languages=languages.slice(0, -2);
		$("#course-desc-language").text( "Offered Languages: " + languages );
	}

	if(data.course_description != null && data.course_description != "")
		$( "#course-desc-text" ).text( data.course_description );
}
//***********************************

//***FILL IN COURSE SCHEDULE ***//
function showSchedule(data_course, data_schedule){
	var schedule =data_schedule;
	var schedule_table="";

	$('#course-schedule-daterange').text ( data_course.start_date + " to " + data_course.end_date);
	$('#course-schedule-interval').text ( data_course.course_interval + " classes" ); 

	if(schedule != null && schedule.length){
		schedule_table+='    <thead>';
		schedule_table+='        <tr class = "tableheader">';
		schedule_table+='            <th>Day of Week</th>';
		schedule_table+='            <th>Date</th>';
		schedule_table+='            <th>Month</th >';
		schedule_table+='            <th>Time</th>';
		schedule_table+='        </tr>';
		schedule_table+='    </thead>';
		schedule_table+='    <tbody>';

		for(var i = 0; i < schedule.length; i++){
			schedule_table+='        <tr>';
			schedule_table+='            <td>' + schedule[i].day_of_week + '</td>';
			schedule_table+='            <td>' + schedule[i].date + '</td>';
			schedule_table+='            <td>' + schedule[i].month + '</td>';
			schedule_table+='            <td>' + schedule[i].start_time + " - " + schedule[i].end_time + '</td>';
			schedule_table+='        </tr>';
		}
		schedule_table+='    </tbody>';
		//Apply to HTML
		$("#course-schedule-datetable").append(schedule_table);
	}
	else{
		$("#course-schedule-scroller").hide();
		$("#course-schedule-scroller").after("<p>There are currently no scheduled course days.</p>");
	}
}
//*****************************

//***FILL IN INSTRUCTOR INFORMATION ***//
function showInstructor(data){
	$('#course-instructor-name').text ( data.instructor_name );
	$('#course-instructor-desc').text ( data.instructor_bio ); 

}


//===============================================================
//===============================================================
//======STAFF+ FUNCTIONS=========================================
//===============================================================
//===============================================================

//*** ADD EDIT GLYPHS ***//
function addEditButtons(){
	$('#course-description-header').append('<i class="fa fa-pencil-square-o fa-lg pull-right editinfobutton" onclick="editModeDescription();"></i>');
	//$('#course-schedule-header').append('<i class="fa fa-pencil-square-o fa-lg pull-right editinfobutton" onclick=";"></i>'); //*** CANNOT MODIFY SCHEDULE FOR NOW
	$('#course-instructor-header').append('<i class="fa fa-pencil-square-o fa-lg pull-right editinfobutton" onclick="editModeInstructor();"></i>');
	$('#course-tags-header').append('<i class="fa fa-pencil-square-o fa-lg pull-right editinfobutton" onclick="editModeTags();"></i>');
}

//======================================================
//======= MANAGE DESCRIPTION ===========================
//======================================================
function editModeDescription(){
	var descForm = "";
	$('#course-description-content').hide();
	descForm+='<form role="form" method="post" id="course-description-form" onsubmit="commitDescription();return false">';
	descForm+='	<div class="form-group col-sm-8">';
	descForm+=' 	<label for="commit-target">Course Target:</label>';
	descForm+='		<input class="form-control" type="text" name="target" id="commit-target"></input>';
	descForm+=' </div>';
	descForm+='	<div class="form-group col-sm-8">';
	descForm+=' 	<label for="commit-desc">Course Description:</label>';
	descForm+='		<textarea class="form-control" type="text" name="desc" id="commit-desc"></textarea>';
	descForm+=' </div>';
	descForm+='	<div class="form-group col-sm-8">';
	descForm+=' 	<label for="commit-desc">Course Cost:</label>';
	descForm+='		<input class="form-control" type="number" name="cost" id="commit-cost"></input>';
	descForm+=' </div>';
	descForm+='	<div class="col-sm-6">';
	descForm+='		<button class="btn btn-default" type="submit">Save</button>';
	descForm+='		<button class="btn btn-default" type="button" onclick="readModeDescription();">Cancel</button>';
	descForm+='	</div>';
	descForm+='</form>';

	if(!$('#course-description-form').length){
		$('#course-description-content').after(descForm);
		$('#commit-target').val($('#course-desc-target').text());
		$('#commit-desc').val($('#course-desc-text').text());
		$('#commit-cost').val($('#course-desc-cost').val());
	}
}

function readModeDescription(){
	$('#course-description-content').show();
	$('#course-description-form').remove();
}

function commitDescription(){
	$.post('/staff/portal/detailedcourse/updateDescription', {
		default_fee: $('#commit-cost').val(),
		course_target: $('#commit-target').val(),
		course_description: $('#commit-desc').val(),
		course_id: getParameterByName('course'),
		_csrf: $('#_csrf').val()
	}).done(function(res){
		console.log(res);
		updateDescription();
		readModeDescription();
	}).fail(function(){
		console.log('ERROR');
	});
}

function updateDescription(){
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories	
		//data[1] holds a list of all existing category types
		//data[2] holds list of users enrolled to the course
		//data[3] holds course schedule
		//***//
		showDescription(data[0].course);
	});	
}

//======================================================
//======= MANAGE INSTRUCTOR INFO =======================
//======================================================

function editModeInstructor(){
	var instForm="";
	$('#course-instructor-content').hide();

	instForm+='<form role="form" method="post" id="course-instructor-form" onsubmit="commitInstructor();return false">';
	instForm+='	<div class="form-group col-sm-8">';
	instForm+=' 	<label for="commit-target">Instructor Name:</label>';
	instForm+='		<input class="form-control" type="text" name="name" id="commit-name"></input>';
	instForm+=' </div>';
	instForm+='	<div class="form-group col-sm-8">';
	instForm+=' 	<label for="commit-target">Instructor Username:</label>';
	instForm+='		<input class="form-control" type="text" name="username" id="commit-username"></input>';
	instForm+=' </div>';
	instForm+='	<div class="form-group col-sm-8">';
	instForm+=' 	<label for="commit-desc">Instructor Description:</label>';
	instForm+='		<textarea class="form-control" type="text" name="desc" id="commit-inst"></textarea>';
	instForm+=' </div>';
	instForm+='	<div class="col-sm-6">';
	instForm+='		<button class="btn btn-default" type="submit">Save</button>';
	instForm+='		<button class="btn btn-default" type="button" onclick="readModeInstructor();">Cancel</button>';
	instForm+='	</div>';
	instForm+="</form>";

	if(!$('#course-instructor-form').length){
		$('#course-instructor-content').after(instForm);
		$('#commit-name').val( $('#course-instructor-name').text() );
		$('#commit-inst').val( $('#course-instructor-desc').text() );
	}
}

function readModeInstructor(){
	$('#course-instructor-content').show();
	$('#course-instructor-form').remove();
}

function commitInstructor(){
	$.post('/staff/portal/detailedcourse/updateInstructor', {
		instructor_name: $('#commit-name').val(),
		instructor_username: $('#commit-username').val(),
		instructor_bio: $('#commit-inst').val(),
		course_id: getParameterByName('course'),
		_csrf: $('#_csrf').val()
	}).done(function(res){
		console.log(res);
		updateInstructor();
		readModeInstructor();
	}).fail(function(){
		console.log('ERROR');
	});
}

function updateInstructor(){
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories	
		//data[1] holds a list of all existing category types
		//data[2] holds list of users enrolled to the course
		//data[3] holds course schedule
		//***//
		showInstructor(data[0].course);
	});	
}

//======================================================
//======= MANAGE COURSE TAGS ===========================
//======================================================

//*** UPDATE THE AUTO COMPLETION LIST DROPDOWN***//
function updateAutoCompleteList(data){
	var autofill_list = [];
	var hash_table = {};

	//SETUP HASH TABLE
	for(var i = 0; i < COURSE_TAG_LIST.length; i++){
		hash_table[COURSE_TAG_LIST[i].category_string] = true;
	}

	//GENERATE TAG LIST
	for(var  i = 0; i < data.length; i++){
		if(!(data[i].category_string in hash_table)){
			autofill_list.push(data[i].category_string);
		}
	}
	
	$('#tags-search').autocomplete({
		source: autofill_list,
		messages: {
        	noResults: '',
        	results: function() {}
    	}
	});
}
//*********************************************

//*** UPDATE THE COURSE'S DISPLAY TAG LIST ***//
function updateCourseTagsList(data, isDisplay){
	var course_tags = $('#tags-sortable');
	course_tags.empty();


	if(isDisplay){
		//Generate Draggable list of course's tags (NOT HIDDEN)
		for(var i = 0; i < data.length; i++){
			course_tags.append('<div class="panel-heading course_tag defaultmouse"><span>' + data[i].category_string + ' </span><a class="editinfobutton" id="tag-remove-'+ data[i].category_id +'" onclick="removeTag('+ data[i].category_id +')">&#10006;</a></div>');
		}
	}
	else{
		//Generate Draggable list of course's tags (HIDDEN)
		for(var i = 0; i < data.length; i++){
			course_tags.append('<div class="panel-heading course_tag defaultmouse"><span>' + data[i].category_string + ' </span><a class="editinfobutton" id="tag-remove-'+ data[i].category_id +'" onclick="removeTag('+ data[i].category_id +')" style="display:none;">&#10006;</a></div>');
		}
	}	
}
//*********************************************

//*** ADD TAG TO COURSE TAGS (NO COMMIT) ***//
function addTag(){
	var category_string = $('#tags-search').val();

	for(var i = 0; i < TAG_LIST.length; i++){
		if(TAG_LIST[i].category_string === category_string){
			COURSE_TAG_LIST.push(TAG_LIST[i]);

			$('#tags-search').val('');
			updateCourseTagsList(COURSE_TAG_LIST, true);
			break;
		}
	}
}
//***************************************************************

//*** REMOVE TAG FROM COURSE TAGS (NO COMMIT) ***//
function removeTag(tag_id){
	var UPDATED_TAG_LIST=[];

	for(var i = 0; i < COURSE_TAG_LIST.length; i++){
		if(COURSE_TAG_LIST[i].category_id != tag_id){
			UPDATED_TAG_LIST.push(COURSE_TAG_LIST[i]);
		}	
	}

	COURSE_TAG_LIST = UPDATED_TAG_LIST;
	updateCourseTagsList(COURSE_TAG_LIST, true);
}

//*** COMMIT TAGS TO DB (AND UPDATES FRONT END) ***//
function commitTags(){
	var list_ids=[];

	//*** GENERATE LIST OF IDS ***//
	for(var i = 0; i < COURSE_TAG_LIST.length; i++){
		list_ids.push(COURSE_TAG_LIST[i].category_id);
	}

	//*** UPDATE COURSE TAGS IN DATABASE ***//
	$.post('/staff/portal/detailedcourse/updateTags',{
		categories: JSON.stringify(list_ids),
		course_id: getParameterByName('course'),
		_csrf: $('#_csrf').val()
	}).done(function (res){
		updateCourseTagsList(COURSE_TAG_LIST, false);
		updateAutoCompleteList(TAG_LIST);
	}).fail(function (){
		console.log('ERROR ADDING COURSE TAG!');
	});
}

//*** UNDO CHANGES TO DB (AND UPDATES FRONT END) ***//
function cancelCommitTags(){
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		TAG_LIST = data[1];
		COURSE_TAG_LIST = data[0].categories;

		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories	
		//data[1] holds a list of all existing category types
		//data[2] holds list of users enrolled to the course
		//data[3] holds course schedule
		//***//
		updateAutoCompleteList(TAG_LIST);
		updateCourseTagsList(COURSE_TAG_LIST, false);
	});	
}
//****************************************************

//*** GO INTO EDIT MODE TAGS ***//
function editModeTags(){
	$('#tags-search').show();
	$('#tags-search-divider').show();
	$('#tags-add').show();
	$('#tags-commit').show();
	$('#tags-cancel').show();

	for(var i = 0; i < COURSE_TAG_LIST.length; i++){
		$('#tag-remove-' + COURSE_TAG_LIST[i].category_id).show();
	}

	$('#tags-edit').hide();
}
//*************************

//*** GO INTO READ MODE TAGS ***//
function readModeTags(){
	$('#tags-edit').show();

	$('#tags-search').hide();
	$('#tags-search-divider').hide();
	$('#tags-add').hide();
	$('#tags-commit').hide();
	$('#tags-cancel').hide();

	for(var i = 0; i < COURSE_TAG_LIST.length; i++){
		$('#tag-remove-'+ COURSE_TAG_LIST[i].category_id).hide();
	}
}


//========================================================
//========MISC FUNCTIONS==================================
//========================================================

//*** Pine Notify ****//
function addedTag(){
	new PNotify({
		title: 'jQuery UI Icon Success',
	    text: 'We reached the moon first! See, we planted a flag.',
	    type: 'success',
	    icon: 'ui-icon ui-icon-flag'
	});
}
//*********************

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getRank(){
	var rank = getCookie('user_info');
	if (rank != null) {
		rank = unescape(rank).substring(2);
		
		return JSON.parse(rank).rank;
	}
	else{
		return 0;
	}
}