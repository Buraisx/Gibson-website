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
		TAG_LIST = data[1];
		COURSE_TAG_LIST = data[0].categories;

		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories
		//data[1] holds a list of all existing category types
		//***//
		updateAutoCompleteList(TAG_LIST);
		updateCourseTagsList(COURSE_TAG_LIST);
	});
}


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

function updateCourseTagsList(data){
	var course_tags = $('#tags-sortable');
	course_tags.empty();

	//Generate Draggable list of course's tags
	for(var i = 0; i < data.length; i++){
		course_tags.append('<div class="course_tag" value=' + data[i].category_id + '>' + data[i].category_string + '</div>');
	}
}

function addTag(){
	var list_ids=[];
	var category_string = $('#tags-search').val();

	for(var i = 0; i < TAG_LIST.length; i++){
		if(TAG_LIST[i].category_string === category_string){
			COURSE_TAG_LIST.push(TAG_LIST[i]);

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
				updateCourseTagsList(COURSE_TAG_LIST);
			}).fail(function (){
				console.log('ERROR ADDING COURSE TAG!');
			});

			break;
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