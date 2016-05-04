function makeEvent(){
  $.post('/staff/portal/addEvent', {
    _csrf: $('#_csrf').val(),
    startdate: $('#startdate').val(),
    enddate: $('#enddate').val(),
    message: $('#message').val(),
    eventtype: $('#eventtype').val()
  })
  .done(function(res){
    swal({
			title: "Event Created",
			text: $('#eventtype').val() +" event created.",
			type: "success"
		});
  })
  .fail(function(res){
    swal({
			title: "Event Creation Failed",
			text: "Fail to create " +$('#eventtype').val() +" event.",
			type: "error"
		});
  });
}
