//On ready load profile info
$(document).ready(function(){
	load_cart();
});

function load_cart(){
	jQuery.getJSON("/cart/view", function(course_info){
		console.log(course_info);
		//$('#cart-table').contents().remove();
		
		var cart_table = $('#cart-table');

		for(var i = 0; i < course_info.length; i++){
			var item='';
			item+='<tr class="cart-item">';
			item+='    <td class="cart-item-name">'+ course_info[i].course_name +'</td>';
			item+='    <td class="cart-item-code">'+ course_info[i].course_code +'</td>';
			item+='    <td class="cart-item-cost">$'+ course_info[i].default_fee +'</td>';
			item+='    <td class="cart-delete">X</td>';
			item+='</tr>';

			cart_table.append(item);
		}
	});
}