//On ready load get cookie and create login or logout button
$(document).ready(function(){
	var user = getCookie('gibson_user');
	$('#loginoutbutton').contents().remove();
	var button = '';
	if(user != null) {
		button += '<a href="/logout">Logout</a>';
	}
	else {
		button += '<a href="/login">Login</a>';
	}
	$('#loginoutbutton').append(button);
});

//Get cookie Values
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}