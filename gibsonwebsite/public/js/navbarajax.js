//On ready load get cookie and create login or logout button
$(document).ready(function(){
	// Gets JSON from the cookie
	var user_info = unescape(getCookie('user_info')).substring(2);
	// Converts the string to JSON object
	var json = JSON.parse(user_info);
	// Gets data from the JSON
	var user = json.username;
	var rank = json.rank;
	$('#userdisplay').contents().remove();
	var userdisplay = '';
	if(user != null) {
		userdisplay = '<a class = "dropdown-toggle" href="/user/profile">' + "Welcome, " + user + '</a>';
		userdisplay += '<ul class = "dropdown-menu">';
		// Adds link to admin views if user is an admin
		if (rank > 1) {
			userdisplay += '	<li><a href="/admin/profile">Admin Menu</a></li>';
		}
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