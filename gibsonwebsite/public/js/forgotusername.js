function forgotusername(){
	console.log($('#_csrf').val());
	$.post("/forgotusername", {
			email: $('#email').val(),
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		alert("Sent you email with username successfully.");
		
	})
	.fail(function (err){
		alert("The email does not exist.");
	});
}
