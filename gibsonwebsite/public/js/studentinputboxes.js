document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#student').addEventListener('change', reactToCheckbox);
});

//show the students input boxes
function reactToCheckbox() {
	if(student.checked) {

   	$("#student_info").removeClass("hidden").hide().slideDown();
   	/*
	    var element = document.getElementById("student_info").id = 'student_info-show';           
        return false;*/
	}
	else {
		$("#student_info").slideUp();
	}
}