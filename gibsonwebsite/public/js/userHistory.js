//On Click profile tab load profile info
$("a[href$='#account-history']").click(function(){
	load_history();
});

function load_history(){
	jQuery.getJSON("/user/history", function(user_history){
		console.log(user_history);
	});
}