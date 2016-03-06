/*
var waypoints = $('section').waypoint({
  handler: function() {
	console.log("howdy");
    $('section > div').addClass
  },
  offset: '50%'
})
*/
var waypointTwo = $('section > div').each( function() {
	var thisElement = $(this);
	thisElement.css("opacity", "0");
	thisElement.waypoint({
		handler: function() {
			thisElement.addClass('fadedLeft');
			thisElement.css("opacity", "1");
		},
		offset: '90%'
	})
})