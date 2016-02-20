document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#student').addEventListener('change', reactToCheckbox);
    $("#add1").click(function() {
      // Reveals second contact and hides first add button
      $("#second_contact").show();
      $("#add1").hide();
    });
    $("#add2").click(function() {
      // Reveals the third contact and hides the buttons for the second contact
      $("#third_contact").show();
      $("#add2").hide();
      $("#remove2").hide();
    });
    $("#remove2").click(function() {
      // Removes the second contact and reveals first add button
      $("#second_contact").hide();
      $("#add1").show();
    });
    $("#remove3").click(function() {
      // Removes the third contact
      $("#third_contact").hide();
      $("#add2").show();
      $("#remove2").show();
    });

});

//show the students input boxes
function reactToCheckbox() {
   if(student.checked) {
        var element = document.getElementById("student_info").id = 'student_info-show';           
        return false;
   }
   else {
      var element = document.getElementById("student_info-show").id = 'student_info';             
      return false;
   }
}