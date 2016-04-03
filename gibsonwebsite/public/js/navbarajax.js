//On ready load get cookie and create login or logout button
$(document).ready(function(){
	var user_info = getCookie('user_info');
	var userdisplay = '';
	if (user_info != null) {
		// Gets JSON from the cookie
		user_info = unescape(user_info).substring(2);
		// Converts the string to JSON object
		var json = JSON.parse(user_info);
		// Gets data from the JSON
		var user = json.username;
		var rank = json.rank;
		userdisplay = '<a class = "dropdown-toggle" data-toggle="dropdown" href="/user/profile">' + user + '</a>';
		userdisplay += '<ul class = "dropdown-menu">';
		// Adds link to profile views
		userdisplay += '	<li><a href="/user/profile">Profile</a></li>';
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