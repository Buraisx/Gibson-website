$("a[href$='#courses']").click(function() {
	$.ajax({
		url: '/user/profile/courses',
		success: $.getJSON('/user/profile/courses', function(results){
			console.log(results);
		}), 
		error: function() {
			console.log("Error getting courses");
		},
		type: 'GET'
	});
});