//JavaScript to check if password matches
function val() {
    if(frm.passwordhashed.value != frm.password.value)
    {
        alert("Passwords do not match");
        return false;
    }
    return true;
}

//Javascript to check password forms are acceptable
function checkPass()
{
    //Store the password field objects into variables
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('passwordhashed');
    //Store the Confimation Message Object
    var message = document.getElementById('confirmpass');
	//Get next button for enabling/disabling
	var nextBtn = document.getElementById('nextToPage2');
    // For change password form
    var passwordentered = false;
    //Colour red and green
    var greenColor = "#85FF89";
    var redColor = "#FF6262";
    //Compare the values in the password field
    //and the confirmation field when
    // 1. pass2's been changed to non-empty or
    // 2. the message's been changed (i.e., pass2's been
    // changed before)
    if(pass2.value != '' || passwordentered) {
        var passValidity = passValid(pass1.value);
        if(pass1.value == pass2.value && passValidity == 1) {
            // The passwords match and are valid.
            pass2.style.backgroundColor = greenColor;
            if(message != null) {
                message.style.color = greenColor;
                message.innerHTML = "<strong>OK!</strong>"
                if (nextBtn != null) {
                    nextBtn.disabled = false;
                }
            }
        } else {
            if (pass1.value != pass2.value) {
                // The passwords do not match.
                pass2.style.backgroundColor = redColor;
                if(message != null) {
                    message.style.color = redColor;
                    message.innerHTML = "<strong>Passwords do not match!</strong>";
                    if (nextBtn != null) {
                        nextBtn.disabled = true;
                    }
                }
            }
            else {
                // The passwords match but are invalid.
                pass2.style.backgroundColor = redColor;
                if(message != null) {
                    message.style.color = redColor;
                }
                if (passValidity == -1) {
                    if(message != null) {
                        message.innerHTML = "<strong>Password is too short!</strong>";
                    }
                }
                else {
                    if(message != null) {
                        message.innerHTML = "<strong>Password must include at least 1 letter and 1 number.</strong>";
                    }
                }
                if (nextBtn != null) {
                    nextBtn.disabled = true;
                }
            }
        }
        passwordentered = true;
    }
}

// Helper function: check that input password is valid
function passValid(pass) {

    // True if the password is valid, false otherwise
    var status = (pass.match(/(?=.*\d)(?=.*[a-zA-Z])([a-zA-Z0-9!@_]+){6,}/g) == pass);
    if (status) {
        // Returns 1 iff the input password matches the regex
        // (length 6+, at least one letter and one number, no special chars)
        return(1);
    }
    else if (pass.length < 6) {
        // -1 return means the password is too short
        return (-1);
    }
    // Otherwise password is invalid (invalid symbols or doesn't follow the format)
    return (-2);
}
