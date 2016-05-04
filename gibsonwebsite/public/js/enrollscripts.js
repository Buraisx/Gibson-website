function clearUserData(){
	$('#userid').empty();
	$('#email').empty();
	$('#fname').empty();
	$('#lname').empty();
}


function fillUserData(user_data){
	$('#userid').text(user_data[0].user_id);
	$('#email').text(user_data[0].email);
	$('#fname').text(user_data[0].fname);
	$('#lname').text(user_data[0].lname);
}


function displayUser(email){
	$.post("/enroll/search/user", {
			_csrf: $('#_csrf').val(),
			email: email
	})
	.done(function (res){
		console.log("You have found the user!");
		console.log(res);
		clearUserData();
		fillUserData(res);
	})
	.fail(function (err){
		console.log("This user does not exist.");
		clearUserData();
	});
}
