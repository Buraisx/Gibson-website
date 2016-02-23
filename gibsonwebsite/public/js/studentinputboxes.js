document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#student').addEventListener('change', reactToCheckbox);
});

//show the students input boxes
function reactToCheckbox() {
	if(student.checked) {
	   	$("#student_info").removeClass("hidden").hide().slideDown();
	   	document.getElementById("schoolname").required = true;
	    document.getElementById("grade").required = true;
	}
	else {
		$("#student_info").slideUp();
		document.getElementById("schoolname").required = false;
	    document.getElementById("grade").required = false;
	}
}