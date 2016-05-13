//*** GLOBAL VARIABLES ***//
var TAG_LIST=[];	//LIST OF ALL TAGS 
var COURSE_TAG_LIST=[]; //LIST OF ALL COURSE TAGS
//***********************//

$(function() {
	$( "#tags-sortable" ).sortable({ 
		placeholder: "ui-sortable-placeholder" 
	});
});

$(document).ready(getCourseTags());


function getCourseTags() {
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		var TAG_LIST = data[1];
		var COURSE_TAG_LIST = data[0].categories;

		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories
		//data[1] holds a list of all existing category types
		//***//
		
		updateAutoCompleteList(data[1]);
		updateCourseTagsList(data[0].categories);
	});
}


function updateAutoCompleteList(data){
	var autofill_list = [];

	//Generate tag list
	for(var i = 0; i < data.length; i++){
		autofill_list.push(data[i].category_string);
	}
	
	$('#tags-search').autocomplete({
		source: autofill_list,
		messages: {
        	noResults: '',
        	results: function() {}
    	}
	});
}

function updateCourseTagsList(data){
	var course_tags = $('#tags-sortable');
	course_tags.empty();

	//Generate Draggable list of course's tags
	for(var i = 0; i < data.length; i++){
		course_tags.append('<li class="ui-state-default" value=' + data[i].category_id + '>' + data[i].category_string + '</li>');
	}
}

function addTag(category_string){
	for(var i = 0; i < TAG_LIST.length; i++){
		if(TAG_LIST[i].category_string === category_string){
			//*** UPDATE COURSE TAGS IN DATABASE ***//
		}
	}
}

function editMode(){
	$('#tags-search').show();
	$('#tags-search-divider').show();
	$('#tags-add').show();
}

function addedTag(){
	new PNotify({
		title: 'jQuery UI Icon Success',
	    text: 'We reached the moon first! See, we planted a flag.',
	    type: 'success',
	    icon: 'ui-icon ui-icon-flag'
	});
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}