//On Click profile tab load profile info
$("a[href$='#account-history']").click(function(){
	load_history();
});

function load_history(){
	$.post("/user/profile/history", {
		query_limit: 20,
		_csrf: $('#_csrf').val()
	}).done(function(res){
		$('#account-history').contents().remove();
		var history = '';
		var i;
        history+='<hr>';
        history+='<h1>Your Past Account Transactions</h1>';
        if(res.length > 0)
        {
			history+='<table class = "table table-bordered">';
			history+='    <thead>';
			history+='        <tr class = "tableheader">';
			history+='            <th>Date</th>';
			history+='            <th>Payer</th>';
			//history+='            <th>State</th>';
			history+='            <th>Payment Type</th>';
			history+='            <th>Transaction ID</th>';
			history+='            <th class = "col-sm-4">Description</th>';
			// history+='            <th>Paypal ID</th>';
			history+='            <th>Total</th>';
			history+='        </tr>';
			history+='    </thead>';
			history+='    <tbody>';
        	for(i = 0; i < res.length; i++) {
				var date = String(res[i].create_time).substring(0, 10); // Substring of valuable part
				var state = res[i].state.charAt(0).toUpperCase() + res[i].state.slice(1); // Capitalizes first letter
				history+='        <tr class="transaction-info">';
				history+='            <td>' + date + '</td>';
				history+='            <td>' + res[i].payer_first_name + ' ' + res[i].payer_last_name + '</td>';
				//history+='            <td>' + state + '</td>';
				history+='            <td>' + res[i].payment_method + '</td>';
				history+='            <td>' + emptyIfUndefined(res[i].payment_id) + '</td>';
				history+='            <td>' + res[i].description + '</td>';
				//history+='            <td>' + res[i].transaction_id + '</td>';
				history+='            <td>' + "$ " + res[i].total.toFixed(2) + '</td>';
				history+='        </tr>';
			}
			history+='    </tbody>';
			history+='</table>';
        }
        //if there is no history
        else
        {
				history+= '<div id="empty-courses"><p>You have no previous transactions.</p></div>';
		}
		$('#account-history').append(history);
	});
}

function emptyIfUndefined(value){
	if(value == null){
		return "";
	}
	else{
		return value;
	}
}