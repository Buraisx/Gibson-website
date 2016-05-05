$( document ).ready(function() {
	loadCourses();
});

function cat(){
	//recordTransaction();
	//alert("hi");
	alert($('#fname').val());
}

var courses;
var cartCourses;

//-- search for user with the email in the database and dropdown the information of the user if exists --//
function clearUserData(){
	$('#user-info').hide("slow", function(){
		$('#userid').empty();
		$('#email').empty();
		$('#fname').empty();
		$('#lname').empty();
	});
}


function fillUserData(user_data){
	$('#user-id').text(user_data[0].user_id);
	$('#user-email').text(user_data[0].email);
	$('#user-fname').text(user_data[0].fname);
	$('#user-lname').text(user_data[0].lname);
	$('#user-id').val(user_data[0].user_id);
	$('#user-email').val(user_data[0].email);
	$('#user-fname').val(user_data[0].fname);
	$('#user-lname').val(user_data[0].lname);
	$('#user-info').show("slow");
	$('#next-step1').removeProp("disabled");
	$('#next-step1').show("slow");
}


function displayUser(email){
	$.post("/enroll/search/user", {
			_csrf: $('#_csrf').val(),
			email: email
	})
	.done(function (res){
		console.log("You have found the user!");
		clearUserData();
		fillUserData(res);
	})
	.fail(function (err){
		console.log("This user does not exist.");
		clearUserData();
		//fillUserData([{user_id:1, email:"Benjamin.zhao1995@hotmail.com", fname:"Benji", lname:"Zhao"}]);
	});
}


//-- load courses and check if courses have checked or not to enable/disable next button --//
function addCheckedCourses (){

	var coursesChecked = [];

	for(var i = 0; i <courses.length; i++){
		if($('#'+courses[i].course_id).is(':checked')){
			coursesChecked.push($('#'+courses[i].course_id).val());
		}
	}
	console.log(coursesChecked);
	$.post("/enroll/courses", {
		selected_courses: coursesChecked,
		_csrf: $('#_csrf').val()
	})
	.done(function (res){
		cartCourses = res;
		load_cart();
	})
	.fail(function (err){
	});
}

function atLeastOneCourseChecked (){

	var coursesChecked = 0;

	for(var i = 0; i <courses.length; i++){
		if($('#'+courses[i].course_id).is(':checked')){
			$('#next-step2').removeProp("disabled");
			coursesChecked += 1;
		}
	}

	if(coursesChecked == 0){
		$('#next-step2').prop("disabled", true);
	}
}

function loadCourses(){
	$.get("/enroll/courses")
	.done( function (res){
		console.log("Loaded courses.");
		courses = res;
		var courselists = '';
		console.log(res);
		for(var i = 0; i < res.length; i++){
			courselists += '<div class="row">';
			courselists += '<div>';
			courselists += '<input type="checkbox" id="'+ res[i].course_id +'" name="'+ res[i].course_id +'" value="' + res[i].course_id +'" onclick="atLeastOneCourseChecked ();">' + res[i].course_name + ',' + res[i].course_code;
			courselists += '</div>';
			courselists += '</div>';
		}
		$('#courselist').append(courselists);

	})
	.fail(function (err){
		console.log("Failed to load courses.");
	});
}

//-- load the cart of courses to show payer the transaction total and items --//
function load_cart(){
		var cart_table = $('#cart-table');

		var cart_total = 0;

        var cart_empty = true;

        console.log(cartCourses);

		for(var i = 0; i < cartCourses.length; i++){
			cart_total += cartCourses[i].default_fee;
            cart_empty = false;

			var item='';
			item+='<tr class="cart-item">';
            item+='    <td class="cart-item-code">'+ cartCourses[i].course_code +'</td>';
			item+='    <td class="cart-item-name">'+ cartCourses[i].course_name +'</td>';
			item+='    <td class="cart-item-cost"><span class="dollar">$</span>'+ cartCourses[i].default_fee.toFixed(2) +'</td>';
			item+='</tr>';

			cart_table.append(item);
		}
        if (!cart_empty){

            //remove empty cart text
            $('#empty-cart').contents().remove();

        	//add total
            var cart_total_html = '';
                cart_total_html+= '<tr class="cart-total">';
                cart_total_html+= 		'<td class="cart-total-name"></td>';
                cart_total_html+=       '<td class="cart-total-code">TOTAL</td>';
                cart_total_html+= 		'<td class="cart-total-cost"><span class="dollar">$</span>' + cart_total.toFixed(2) + '</td>';
                cart_total_html+= '</tr>'

            cart_table.append(cart_total_html);

        }
}

//-- confirmation alert to tell the payer to pay the payment right now --//
function confirmationAlert(){
	swal({  
		title: "Please Pay The Transaction.",
        type: "success"
    });
}

//-- record transaction to database --//
function recordTransaction(){

	$.post("/enroll", {
			_csrf: $('#_csrf').val(),
			email: $('#email').val(),

	})
	.done(function (res){
		console.log("You have found the user!");
		clearUserData();
		fillUserData(res);
	})
	.fail(function (err){
		console.log("This user does not exist.");
		clearUserData();
		//fillUserData([{user_id:1, email:"Benjamin.zhao1995@hotmail.com", fname:"Benji", lname:"Zhao"}]);
	});

}