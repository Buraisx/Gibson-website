function togglepassworddropdown() {
	if ($("#change_password").is(":visible")) {
		$("#change_password").slideUp();
	}
	else {
	   	$("#change_password").removeClass("hidden").hide().slideDown();
	}
}

function toggleaddecontact() {
	if ($("#addecontact").is(":visible")) {
		$("#addecontact").slideUp();
	}
	else {
	   	$("#addecontact").removeClass("hidden").hide().slideDown();
	}
}