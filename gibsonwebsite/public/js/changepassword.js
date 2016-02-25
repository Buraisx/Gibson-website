function togglepassworddropdown() {
	if ($("#change_password").is(":visible")) {
		$("#change_password").slideUp();
	}
	else {
	   	$("#change_password").removeClass("hidden").hide().slideDown();
	}
}