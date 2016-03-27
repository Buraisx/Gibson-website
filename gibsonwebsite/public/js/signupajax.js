function signup() {
	$.post("/signup", {
			_csrf: $('#_csrf').val(),
			username: $('#username').val(),
      password: $('#password').val(),
      email: $('#email').val(),
			fname: $('#fname').val(),
			lname: $('#lname').val(),
      birth_date: $('#datepicker').val(),
      gender: $('#gender').val(),
      address: $('#address').val(),
      postal_code: $('#postal_code').val(),
      apt: $('#apt').val(),
      city: $('#city').val(),
      province: $('#province').val(),
      student: $('#student').val(),
      schoolname: $('#schoolname').val(),
      grade: $('#grade').val(),
			major: $('#major').val(),
			esl: $('#esl').val(),
			primary_phone: $('#primary_phone').val(),
			secondary_phone: $('#secondary_phone').val(),
      emergencyfname1: $('#emergencyfname1').val(),
      emergencyfname2: $('#emergencyfname2').val(),
      emergencyfname3: $('#emergencyfname3').val(),
      emergencylname1: $('#emergencylname1').val(),
      emergencylname2: $('#emergencylname2').val(),
      emergencylname3: $('#emergencylname3').val(),
      relationship1: $('#relationship1').val(),
      relationship2: $('#relationship2').val(),
      relationship3: $('#relationship3').val(),
      ephone1: $('#ephone1').val(),
      ephone2: $('#ephone2').val(),
      ephone3: $('#ephone3').val()
	})
	.fail(function (err){
		alert('Registration failed.');
	});
}
