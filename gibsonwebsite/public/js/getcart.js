//On ready load profile info
$(document).ready(function(){
	load_cart();
});

function delete_course(cart_course){

	$.post("/cart/course/delete", {
			course_id: cart_course.value,
			_csrf: $('#_csrf').val()
	})
	.done(function (res){
        location.reload();
	})
    
	.fail(function (err){
		
		swal({
			title: "You can not delete this course."
		});
	});
}


function load_cart(){
	jQuery.getJSON("/cart/view", function(course_info){
		console.log(course_info);
		//$('#cart-table').contents().remove();
		
		var cart_table = $('#cart-table');

		var cart_total = 0;
        
        var cart_empty = true;

		for(var i = 0; i < course_info.length; i++){
			cart_total += course_info[i].default_fee;
            cart_empty = false;
            
			var item='';
			item+='<tr class="cart-item">';
			item+='    <td class="cart-item-name">'+ course_info[i].course_name +'</td>';
			item+='    <td class="cart-item-code">'+ course_info[i].course_code +'</td>';
			item+='    <td class="cart-item-cost"><span class="dollar">$</span>'+ course_info[i].default_fee +'.00</td>';
			item+='    <td class="cart-item-delete"> <button type="button" class = "btn-xsm btn-danger" action="/cart/course/delete" onclick="delete_course(this)" method="POST" id="submit" value="' + course_info[i].course_id +'">X</button> </td>';
			item+='</tr>';

			cart_table.append(item);
		}
        
        if (!cart_empty){
            var cart_total_html = '';
                cart_total_html+= '<tr class="cart-total">';
                cart_total_html+= 		'<td class="cart-total-name"></td>';
                cart_total_html+=       '<td class="cart-total-code">TOTAL</td>';
                cart_total_html+= 		'<td class="cart-total-cost"><span class="dollar">$</span>' + cart_total + '.00</td>';
                cart_total_html+=       '<td class="cart-total-delete"></td>';
                cart_total_html+= '</tr>'

            cart_table.append(cart_total_html);
        }
        
	});
}