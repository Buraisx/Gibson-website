/*
$("a[href$='#courses']").click(function() {
	$.ajax({
		datatype: "json",
		url: '/user/profile/courses',
		success: $.getJSON('/user/profile/courses', function(data){
			console.log(data);
		}), 
		error: function() {
			console.log("Error getting courses");
		},
		type: 'GET'
	});
});
*/

$("a[href$='#courses']").click(function() {

	jQuery.getJSON("/user/profile/courses", function(data){
	
		for(i = 0; i < data.length; i++){
			
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
			document.getElementById("description").innerHTML = "lol";
		}	
				
	});
});


