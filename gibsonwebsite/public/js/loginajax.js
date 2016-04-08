function loginajax(){
	$.post("/login", {
    	_csrf: $('#_csrf').val(),
		username: $('#username').val(),
    	password: $('#password').val()
	})
	.done(function (res){
    	//window.location.href = '/user/profile';
	})
	.fail(function (err){
		swal({
			title: "Login failed.",
			text: "Username and password don't match.",
			type: "error"
		});
	});
}
