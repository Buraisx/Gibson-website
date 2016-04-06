function loginajax(){
	$.post("/login", {
			username: $('#username').val(),
      password: $('#password').val(),
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
	})
	.fail(function (err){
		alert("Invalid Credential");
	});
}
