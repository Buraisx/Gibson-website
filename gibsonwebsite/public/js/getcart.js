//On ready load profile info
$(document).ready(function(){
	load_cart();
});
/*
function delete(cart_course){

	$.post("/cart/course/delete", {
			course_id: cart_course.value,
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
		
		swal({
			title: "Course deleted from the cart.",
			type: "success"
		});

	})
	.fail(function (err){
		
		swal({
			title: "You can not delete this course."
		});
	});
}*/

function load_cart(){
	jQuery.getJSON("/cart/view", function(course_info){
		console.log(course_info);
		//$('#cart-table').contents().remove();
		
		var cart_table = $('#cart-table');

		var cart_total = 0;

		for(var i = 0; i < course_info.length; i++){
			cart_total += course_info[i].default_fee;
			var item='';
			item+='<tr class="cart-item">';
			item+='    <td class="cart-item-name">'+ course_info[i].course_name +'</td>';
			item+='    <td class="cart-item-code">'+ course_info[i].course_code +'</td>';
			item+='    <td class="cart-item-cost">$'+ course_info[i].default_fee +'</td>';
			item+='    <td class="cart-delete"> <button type="button" class = "btn-xsm btn-danger" action="/cart/course/delete" onclick="delete(this)" method="POST" id="submit" value="' + course_info[i].course_id +'">X</button> </td>';
			item+='</tr>';

			cart_table.append(item);
		}
		var cart_total_html = '';
			cart_total_html+= '<tr class="cart-total">';
			cart_total_html+= 		'<td class="cart-total-name cart-item-name">Total</td>';
			cart_total_html+= 		'<td class="cart-total-cost cart-item-cost">$' + cart_total + '</td>';
			cart_total_html+= '</tr>'

		cart_table.append(cart_total_html);

		//this is alternative total placed on bottom
		var cart_end = $('#cart-total');

		var cart_total_html_2 = '';
			cart_total_html_2+= '<p>';
			cart_total_html_2+= '<span class="cart-total-name2">Total: </span>';
			cart_total_html_2+= '<span class="cart-total-cost2">$' + cart_total + '</span>';
			cart_total_html_2+= '</p>';

		cart_end.append(cart_total_html_2);
	});
}