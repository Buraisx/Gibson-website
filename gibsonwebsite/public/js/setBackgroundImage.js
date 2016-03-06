function setBackgroundImage(items) {
	if (items === undefined || items === null) {
		return;
	}
	else {
		items.each( function() {
			var theElement = $(this),
				backgroundUrl = theElement.attr('data-background');


		});
	}
}

setBackgroundImage( $('.background-imgr') );
setBackgroundImage( $('.static-background') );
setBackgroundImage( $('.absolute-background') );