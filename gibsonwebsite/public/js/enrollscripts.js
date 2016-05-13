$( document ).ready(function() {
	loadCourses();
});

var courses;
var cartCourses;
var cartTotal;

//-- search for user with the email in the database and dropdown the information of the user if exists --//
function clearUserData(){
	$('#user-info').hide("slow", function(){
		$('#user-id').empty();
		$('#user-email').empty();
		$('#user-fname').empty();
		$('#user-lname').empty();
	});
}


function fillUserData(user_data){
	$('#user-id').text(user_data[0].user_id);
	$('#user-email').text(user_data[0].email);
	$('#user-fname').text(user_data[0].fname);
	$('#user-lname').text(user_data[0].lname);
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
		$('#next-step1').prop("disabled", true);
		swal({
		title: "The User Does Not Exist."});

	});
}

//-- load courses and check if courses have checked or not to enable/disable next button --//
function addCheckedCourses (){

	var coursesChecked = [];

	for(var i = 0; i <courses.length; i++){
		if($('#'+courses[i].sku).is(':checked')){
			coursesChecked.push($('#'+courses[i].sku).val());
		}
	}

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
		if($('#'+courses[i].sku).is(':checked')){
			
			//move checked course to the right div
			$('#selectedcourselist').append($('#course'+[i]).clone());
			$('#course'+[i]).remove();
			//disable next button
			$('#next-step2').removeProp("disabled");

			coursesChecked += 1;
		}

		//move unchecked course to the left div if in the right div
		else if ((!$('#'+courses[i].sku).is(':checked')) && ($('#'+courses[i].sku).parents('#selectedcourselist').length == 1)){
			
			var contents = $('#course'+[i]);
			$('#course'+[i]).remove();
			$('#courselist').append(contents);
			//$('#courselist').append('<div> hi </div>');
			
		}
	}

	if(coursesChecked == 0){

		//enable next button
		$('#next-step2').prop("disabled", true);
	}
}

function loadCourses(){
	$.get("/enroll/courses")
	.done( function (res){
		console.log("Loaded courses.");
		courses = res;
		var courselists = '';
	
		for(var i = 0; i < res.length; i++){
			courselists += '<div id="course'+ [i] +'" class="row">';
			courselists += '<div>';
			courselists += '<label id ="label'+ res[i].sku +'"><input type="checkbox" id="'+ res[i].sku +'" name="'+ res[i].sku +'" value="' + res[i].sku +'" onclick="atLeastOneCourseChecked ();">' + res[i].course_code + ', ' + res[i].course_name +'</label>';
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

            cartTotal = cart_total.toFixed(2);

            cart_table.append(cart_total_html);

        }
}
//clear cart and addcheckedcourses
function clearAndAdd(){
	addCheckedCourses();
	clearCart();
}
//--clear the cart on back clip of step 3-- //

function clearCart(){
	//clear the cart-table and rebuild the html
	$('#cart-table').contents().remove();

	var item = '';
    item+='<tr class="shoppingheader">';
    item+='<td id="cart-header-code">Course Code</td>';
    item+='<td id="cart-header-name">Course Name</td>';
    item+='<td id="cart-header-cost">Cost</td>';
    item+='</tr>';

    $('#cart-table').append(item);

    //clear cart and rebuild
    $('#empty-cart').contents().remove();
    var emptytext = '<p id="empty-cart-text1">Oops! Your shopping cart is empty!</p>';
    $('#empty-cart').append(emptytext);


}

//-- confirmation alert to tell the payer to pay the payment right now --//
function confirmationAlert(){
	swal({  
		title: "Please Pay The Transaction."
    });

    userID();
}

//--give front end names of account --//

function userID(){
	$('#user_id').val($('#user-id').text());
}

function firstName(){
	$('#first_name').val($('#user-fname').text());
}

function lastName(){
	$('#last_name').val($('#user-lname').text());
}

//-- autofill the first name, last name, and id fields with account information --//
function autoFill(){

	firstName();
	lastName();
}

//-- clear the fields of first name, last name, and id fields --//
function clearFields(){

	$('#first_name').val("");
	$('#last_name').val("");
}

function toggleFields(){

	if(($('#first_name').val() == "" ) || ($('#last_name').val() == "" )){
		autoFill();
	}
	else{
		clearFields();
	}	
}

//-- prompt volunteer/admin/staff for password in order to record the transaction --
function askForPassword (){

	if($('#payment_method').val() == ""){
		swal({
		title: "Payment Type Not Selected."}, function(){
			return false;
		});
	}
	else if(($('#trans_id').val() == "")){
		swal({
		title: "Payment ID Not Filled."}, function(){
			return false;
		});
	}
	else if($('#description').val() == ""){
		swal({
		title: "Description Not Filled."}, function(){
			return false;
		});

	}
	else{
		swal({
		title: "Enter The Administrative Password.",
		type: "input",
		inputType: "password",
		animation: "slide-from-top",   
		inputPlaceholder: "Password"},
		function(typedPassword){
			$('#password').val(typedPassword);
			recordTransaction();
		});
	}		
}

function cartCodes(){
	var item_list=[];

	for(var i = 0; i < cartCourses.length; i++){
		item_list.push({sku: cartCourses[i].sku});
	}

	return item_list;
}

//-- record transaction to database --//
function recordTransaction(){

	$.post("/enroll", {
			_csrf: $('#_csrf').val(),
			email: $('#email').val(),
			first_name: $('#first_name').val(),
			last_name: $('#last_name').val(),
			user_id: $('#user_id').val(),
			trans_id: $('#trans_id').val(),
			payment_method: $('#payment_method').val(),
			description: $('#description').val(),
			total: cartTotal,
			item_list: JSON.stringify(cartCodes()),
			password: $('#password').val()

	})
	.done(function (res){
		console.log("You have recorded the transaction!");
		window.location.href = '/enrollSuccess';
	})
	.fail(function (err){
		console.log("Failed to record the transaction.");
		swal({ title: "Incorrect Password", type: "error"});
	});

}