var MAX = 3;

function addcontact() {
  var i = 1;
  // Iterates through every contact, checking if they're visible
  while($("#contact" + i).is(":visible")) {
      i++;
  }
  // Prevents adding beyond the max (protects against people messing with HTML)
  if (i <= MAX) {
    // Shows next contact
    $("#contact" + i).show();
    document.getElementById("emergencyfname" + i).required = true;
    document.getElementById("emergencylname" + i).required = true;
    document.getElementById("relationship" + i).required = true;
    document.getElementById("ephone" + i).required = true;
  }
  // If after this there is the maximum number of contacts, hide the add button
  if (i >= MAX) {
    $("#add").hide();
  }
  // Reveals the show button
  $("#remove").show();
}


function removecontact() {
  var i = 1;
  // Iterates through every contact, checking if they're visible
  while($("#contact" + i).is(":visible")) {
      i++;
  }
  // Sets i to the contact to be removed
  i--;
  // Disables removing the first contact (protects against people messing with HTML)
  if (i !== 1) {
    // Hides previous contact
    $("#contact" + i).hide();
    var emergencyfname = document.getElementById("emergencyfname" + i);
    emergencyfname.required = false;
    emergencyfname.value = "";
    var emergencylname = document.getElementById("emergencylname" + i);
    emergencylname.required = false;
    emergencylname.value = "";
    var relationship = document.getElementById("relationship" + i);
    relationship.required = false;
    relationship.value = "";
    var ephone = document.getElementById("ephone" + i);
    ephone.required = false;
    ephone.value = "";
    // If we were at the maximum number of contacts and now we are not, show the hidden add button
    if (i == MAX) {
          $("#add").show();
    }
    // If we are now at the minimum number of contacts, hide the remove button
    else if (i == 2) {
          $("#remove").hide();
    }
  }
}