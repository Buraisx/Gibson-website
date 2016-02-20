//JavaScript to check if password matches
function val() {
    if(frm.passwordhashed.value != frm.password.value)
    {
        alert("Passwords does not match");
        return false;
    }
    return true;
}

var password = document.getElementById("password"),
confirm_password = document.getElementById("passwordhashed");

//Javascript to check passwords matches
function checkPass()
{
    //Store the password field objects into variables
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('passwordhashed');
    //Store the Confimation Message Object
    var message = document.getElementById('confirmpass');
    //Colour red and green
    var greenColor = "#85FF89";
    var redColor = "#FF6262";
    //Compare the values in the password field 
    //and the confirmation field
    if(pass1.value == pass2.value){
        //The passwords match. 
        pass2.style.backgroundColor = greenColor;
        message.style.color = greenColor;
        message.innerHTML = "Passwords Match!"
    }else{
        //The passwords do not match.
        pass2.style.backgroundColor = redColor;
        message.style.color = redColor;
        message.innerHTML = "Passwords Do Not Match!"
    }
}  