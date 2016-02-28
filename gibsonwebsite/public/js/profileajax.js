$("a[href$='#courses']").click(function() {
	$.ajax({
		url: '/user/profile/courses',
		success: function(results){
			console.log("Get registered courses");
		}, 
		error: function() {
			console.log("Error getting courses");
		},
		type: 'GET'
	});
});