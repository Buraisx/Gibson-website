function val() {

if(frm.passwordhashed.value != frm.password.value)
{
	alert("Passwords does not match");
	return false;
}
return true;
}