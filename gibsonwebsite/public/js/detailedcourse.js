$(function() {
	$( "#sortable-tags" ).sortable({ 
		placeholder: "ui-sortable-placeholder" 
	});
});

$(document).ready(getCourseTags());


function getCourseTags() {
	jQuery.getJSON("/staff/portal/detailedcourse/data", function(data){
		var course_tags = $('#sortable-tags')
		//*** data[0] is course info, data[1] is list of course tags, data[2] is list of all tags ***//
		for(var i = 0; i < data[1].length; i++){
			course_tags.append('<li class="ui-state-default" value=' + data[1][i].category_id + '>' + data[1][i].category_string + '</li>');
		}
	});
}

function addedTag(){
	new PNotify({
		title: 'jQuery UI Icon Success',
	    text: 'We reached the moon first! See, we planted a flag.',
	    type: 'success',
	    icon: 'ui-icon ui-icon-flag'
	});
}