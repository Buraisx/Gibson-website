//On Click profile tab load profile info
$("a[href$='#account-history']").click(function(){
	load_history();
});

function load_history(){
	$.post("/user/profile/history", {
		query_limit: 20,
		_csrf: $('#_csrf').val()
	}).done(function(res){
		console.log(res);
	});
}