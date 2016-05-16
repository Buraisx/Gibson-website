//List users on page ready
$("a[href$='#controlPanel']").ready(function(){
	jQuery.getJSON('/user/listfiller', function(req){
		dropdown_info = {provinces: req.provinces, age_groups: req.age_groups, course_categories: req.course_categories};
		controlpanel(dropdown_info); //staff panel
	});
});

//List users on Click
$("a[href$='#profile']").click(function(){
	//listusers();
});

//List of Courses on click
$("a[href$='#courses']").click(function() {
	//listcourses();
});
