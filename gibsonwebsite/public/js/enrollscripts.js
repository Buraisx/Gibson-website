$( document ).ready(function() {
	loadCourses();
});

var courses;

function addCheckedCourses (){

	var coursesChecked = [];
	
	for(var i = 0; i <courses.length; i++){
		if($('#'+courses[i].course_id).is(':checked')){
			coursesChecked.push($('#'+courses[i].course_id).val());
		}
	}
	console.log(coursesChecked);
	$.post("/enroll/courses", {
		selected_courses: coursesChecked,
		_csrf: $('#_csrf').val()
	})
	.done(function (res){
		alert("HAPPY MEALS");
		
	})
	.fail(function (err){
		alert("SAD MEALS");
	});
}

function clearUserData(){
	$('#user-info').hide("slow", function(){
		$('#userid').empty();
		$('#email').empty();
		$('#fname').empty();
		$('#lname').empty();
	});
}


function fillUserData(user_data){
	$('#user-id').text(user_data[0].user_id);
	$('#user-email').text(user_data[0].email);
	$('#user-fname').text(user_data[0].fname);
	$('#user-lname').text(user_data[0].lname);
	$('#user-info').show("slow");
	$('#next-step1').removeProp("disabled");
	$('#next-step1').show("slow");
}


function displayUser(email){
	$.post("/enroll/search/user", {
			_csrf: $('#_csrf').val(),
			email: email
	})
	.done(function (res){
		console.log("You have found the user!");
		clearUserData();
		fillUserData(res);
	})
	.fail(function (err){
		console.log("This user does not exist.");
		clearUserData();
		//fillUserData([{user_id:1, email:"Benjamin.zhao1995@hotmail.com", fname:"Benji", lname:"Zhao"}]);
	});
}

function atLeastOneCourseChecked (){

	var coursesChecked = 0;

	for(var i = 0; i <courses.length; i++){
		if($('#'+courses[i].course_id).is(':checked')){
			$('#next-step2').removeProp("disabled");
			coursesChecked += 1;
		}
	}

	if(coursesChecked == 0){
		$('#next-step2').prop("disabled", true);
	}
}

function loadCourses(){
	$.get("/enroll/courses")
	.done( function (res){
		console.log("Loaded courses.");
		courses = res;
		var courselists = '';
		console.log(res);
		for(var i = 0; i < res.length; i++){
			courselists += '<div class="row">';
			courselists += '<div>';
			courselists += '<input type="checkbox" id="'+ res[i].course_id +'" name="'+ res[i].course_id +'" value="' + res[i].course_id +'" onclick="atLeastOneCourseChecked ();">' + res[i].course_name + ',' + res[i].course_code;
			courselists += '</div>';
			courselists += '</div>';
		}
		$('#courselist').append(courselists);

	})
	.fail(function (err){
		console.log("Failed to load courses.");
	});
}