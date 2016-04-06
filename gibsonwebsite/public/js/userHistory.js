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
		$('#account-history').contents().remove();
		var history = '';
		var i;
		for(i = 0; i < res.length; i++) {
			var date = String(res[i].create_time).substring(0, 10); // Substring of valuable part
			var state = res[i].state.charAt(0).toUpperCase() + res[i].state.slice(1); // Capitalizes first letter

			history+='<table class = "table table-bordered">';
			history+='    <thead>';
			history+='        <tr class = "tableheader">';
			history+='            <th>Description</th>';
			history+='            <th>Date</th>';
			history+='            <th>ID</th>';
			// history+='            <th>Paypal ID</th>';
			history+='            <th>State</th>';
			history+='            <th>Payer Name</th>';
			history+='            <th>Total</th>';
			history+='        </tr>';
			history+='    </thead>';
			history+='    <tbody>';
			history+='        <tr>';
			history+='            <td>' + res[i].description + '</td>';
			history+='            <td>' + date + '</td>';
			history+='            <td>' + res[i].transaction_id + '</td>';
			// history+='            <td>' + res[i].paypal_id + '</td>';
			history+='            <td>' + state + '</td>';
			history+='            <td>' + res[i].payer_first_name + ' ' + res[i].payer_last_name + '</td>';
			history+='            <td>' + res[i].total + '</td>';
			history+='        </tr>';
			history+='    </tbody>';
			history+='</table>';
		}
		$('#account-history').append(history);
	});
}