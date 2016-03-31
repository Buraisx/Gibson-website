//On ready load profile info
$(document).ready(function(){
	load_cart();
});

function load_cart(){
	jQuery.getJSON("/cart/view", function(course_info){
		console.log(course_info);
	});
}