//GLOBAL TIMER
var typingTimer;
var delay = 1000;
//
//Check username availability
function checkusername(){
      $.post("/signup/username", {
            _csrf: $('#_csrf').val(),
            username: $('#username').val()
      })
      .done(function (res){

            if(!res){
                swal({
                  title: "Username already taken.",
                  type: "error"
                });
            }
      })
      .fail(function (err){
            console.log('Bad username');
      });
}

//check email availability
function checkemail(){
      $.post("/signup/email", {
            _csrf: $('#_csrf').val(),
            email: $('#email').val()
      })
      .done(function (res){
            if(!res){
                swal({
                  title: "Email already taken.",
                  type: "error"
                });
            }
      })
      .fail(function (err){
            console.log('Bad email');
      });
}

function delayUsername(){

      clearTimeout(typingTimer);

      if($('#username').val()){
            typingTimer = setTimeout(checkusername, delay);
      }


}

function delayEmail(){

      clearTimeout(typingTimer);

      if($('#email').val()){
            typingTimer = setTimeout(checkemail, delay);
      }

}

function trueOrFalse(arg){
	if (arg) return 1;
	return 0;
}

//AJAX Signup Post
function signup() {

    var loader =  '<div class="sk-folding-cube">';
        loader += '     <div class="sk-cube1 sk-cube"></div>';
        loader += '     <div class="sk-cube2 sk-cube"></div>';
        loader += '     <div class="sk-cube4 sk-cube"></div>';
        loader += '     <div class="sk-cube3 sk-cube"></div>';
        loader += '</div>';

    swal({
        title: 'Please Wait',
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
		showCancelButton: false,
        html: true,
        text: loader
    });

	$.post("/signup", {
	    _csrf: $('#_csrf').val(),
	    username: $('#username').val(),
      password: $('#password').val(),
      email: $('#email').val(),
	    fname: $('#fname').val(),
	    lname: $('#lname').val(),
      //birth_date: $('#datepicker').val(),
      age_group_id: $('#age_group').val();
      gender: $('#gender').val(),
      address: $('#address').val(),
      postal_code: $('#postal_code').val(),
      apt: $('#apt').val(),
      city: $('#city').val(),
      province: $('#province').val(),
      send_notifications: trueOrFalse($('#send_notifications').is(':checked')),
      student: trueOrFalse($('#student').is(':checked')),
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
	.done(function(res){
            window.location.href = res.redirect_url;
	})
	.fail(function (err){
		swal({
            title: 'Signup Failed',
            type: 'error'
        });
	});
}
