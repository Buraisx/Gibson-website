var MAX = 3;

function addcontact(prefix) {
	// Prefix specifies which set of emergency inputs, for pages with multiple signup pages
	if (prefix == null) {
		prefix = '';
	}
	var i = 1;
	// Iterates through every contact, checking if they're visible
	while($('#' + prefix + 'contact' + i).is(":visible")) {
		i++;
	}
	// Prevents adding beyond the max (protects against people messing with HTML)
	if (i <= MAX) {
		// Shows next contact
		$('#' + prefix + 'contact' + i).removeClass("hidden").hide().slideDown();
		document.getElementById(prefix + "emergencyfname" + i).required = true;
		document.getElementById(prefix + "emergencylname" + i).required = true;
		document.getElementById(prefix + "relationship" + i).required = true;
		document.getElementById(prefix + "ephone" + i).required = true;
	}
	// If after this there is the maximum number of contacts, disable the add button
	if (i >= MAX) {
		$('#' + prefix + 'addbutton').prop('disabled', true);
	}
	// Reveals the show button
	$('#' + prefix + 'removebutton').removeClass("hidden");
	$('#' + prefix + 'removebutton').prop('disabled', false);
}

function removecontact(prefix) {
	if (prefix == null) {
		prefix = '';
	}
	var i = 1;
	// Iterates through every contact, checking if they're visible
	while($('#' + prefix + 'contact' + i).is(":visible")) {
		i++;
	}
	// Sets i to the contact to be removed
	i--;
	// Disables removing the first contact (protects against people messing with HTML)
	if (i !== 1) {
		// Hides previous contact
		$('#' + prefix + 'contact' + i).slideUp();
		setTimeout(function(){
		$('#' + prefix + 'contact' + i).addClass("hidden");
		}, 500);
		document.getElementById(prefix + "emergencyfname" + i).required = false;
		document.getElementById(prefix + "emergencyfname" + i).value = "";
		document.getElementById(prefix + "emergencylname" + i).required = false;
		document.getElementById(prefix + "emergencylname" + i).value = "";
		document.getElementById(prefix + "relationship" + i).required = false;
		document.getElementById(prefix + "relationship" + i).value = "";
		document.getElementById(prefix + "ephone" + i).required = false;
		document.getElementById(prefix + "ephone" + i).value = "";
		// If we were at the maximum number of contacts and now we are not, re-enable the hidden add button
		if (i == MAX) {
			$('#' + prefix + 'addbutton').prop('disabled', false);
		}
		// Hide the remove button if we are now at the minimum number of contacts
		if (i == 2) {
			$('#' + prefix + 'removebutton').addClass("hidden");
		}
		// Disable the remove button if the (i-1)th contact is read only (only on edit info)
		else if ($('#' + prefix + 'contact'+(i-1)).hasClass("ECdisplay")) {
			$('#' + prefix + 'removebutton').prop('disabled', true);
		}
	}
}
