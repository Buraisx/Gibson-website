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
