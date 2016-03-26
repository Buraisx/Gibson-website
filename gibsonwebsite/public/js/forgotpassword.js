function forgotpassword(){

	$.post("/forgotpassword", {
			username: $('#username').val(),
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		alert("Sent you email with password change link successfully.");
		
	})
	.fail(function (err){
		alert("The username does not exist.");
	});
}
