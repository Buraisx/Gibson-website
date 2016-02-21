function updateValues(contact_count) {
	var contact_list = [];
	for (i = 1; i <= contact_count; i++) { 
	


		var fname = document.getElementById("emergencyfname" + i).value;
		var lname = document.getElementById("emergencylname" + i).value;
		var relationship = document.getElementById("relationship" + i).value;
		var ephone = document.getElementById("ephone" + i).value;

	    var str = fname + ", " + lname + ", " + relationship + ", " + ephone;

		alert(str);

		//var parsed_contact = JSON.parse(str);
		//contact_list.push(parsed_contact);

	}



	// alert(JSON.stringify(parsed));

    //console.log("The serialized str is " + str);
    //$(result).text(str);
    // 

}