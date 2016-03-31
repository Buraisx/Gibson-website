//On ready load get cookie and create login or logout button
$(document).ready(function(){
	var user = getCookie('gibson_user');
	$('#userdisplay').contents().remove();
	var userdisplay = '';
	if(user != null) {
		userdisplay = '<a class = "dropdown-toggle" href="/user/profile">' + "Welcome, " + user + '</a>';
		userdisplay += '<ul class = "dropdown-menu">';
		userdisplay += '	<li><a href="/logout">Logout</a></li>';
		userdisplay += '</ul>';
	}
	else {
		userdisplay += '<a href="/login">Login</a>';
	}
	$('#userdisplay').append(userdisplay);
});


//Get cookie Values
function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}