document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#student').addEventListener('change', reactToCheckbox);
});

//show the students input boxes
function reactToCheckbox(){
   if(student.checked){
        var element = document.getElementById("student_info").id = 'student_info-show';           
        return false;
   }
   else{
      var element = document.getElementById("student_info-show").id = 'student_info';             
      return false;
   }
}