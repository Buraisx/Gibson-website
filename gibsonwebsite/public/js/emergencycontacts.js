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
    $("#contact" + i).removeClass("hidden").hide().slideDown();
    document.getElementById("emergencyfname" + i).required = true;
    document.getElementById("emergencylname" + i).required = true;
    document.getElementById("relationship" + i).required = true;
    document.getElementById("ephone" + i).required = true;
  }
  // If after this there is the maximum number of contacts, disable the add button
  if (i >= MAX) {
     $('#addbutton').prop('disabled', true);
  }
  // Reveals the show button
  $("#removebutton").removeClass("hidden");
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
    $("#contact" + i).slideUp();
    setTimeout(function(){
      $("#contact" + i).addClass("hidden");
    }, 500);
    document.getElementById("emergencyfname" + i).required = false;
    document.getElementById("emergencyfname" + i).value = "";
    document.getElementById("emergencylname" + i).required = false;
    document.getElementById("emergencylname" + i).value = "";
    document.getElementById("relationship" + i).required = false;
    document.getElementById("relationship" + i).value = "";
    document.getElementById("ephone" + i).required = false;
    document.getElementById("ephone" + i).value = "";
    // If we were at the maximum number of contacts and now we are not, re-enable the hidden add button
    if (i == MAX) {
          $('#addbutton').prop('disabled', false);
    }
    // If we are now at the minimum number of contacts, hide the remove button
    else if (i == 2) {
          $("#removebutton").addClass("hidden");
    }
  }
}
