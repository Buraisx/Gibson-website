$(function() {
	$( "#sortable-tags" ).sortable({ 
		placeholder: "ui-sortable-placeholder" 
	});
});

$(document).ready(getCourseTags());


function getCourseTags() {
	jQuery.getJSON("/staff/portal/detailedcourse/data",{course: getParameterByName('course')}, function(data){
		var course_tags = $('#tags-sortable');
		var tag_list = [];

		//***// 
		//data[0].course holds all the course info
		//data[0].categories holds a list of course categories
		//data[1] holds a list of all existing category types
		//***//
		
		//Generate tag list
		for(var i = 0; i < data[1].length; i++){
			tag_list.push(data[1].category_string);
		}
		$('tags-search').autocomplete({tag_list});

		//Generate Draggable list of course's tags
		for(var i = 0; i < data[0].categories.length; i++){
			course_tags.append('<li class="ui-state-default" value=' + data[0].categories[i].category_id + '>' + data[0].categories[i].category_string + '</li>');
		}
	});
}

function editMode(){
	$('tags-search').show();
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