function setBackgroundImage(items) {
		items.each( function() {
			var theElement = $(this),
				backgroundURL = theElement.attr('data-background');

			theElement.css({
				'background-image': 'url(' + backgroundURL + ')'
			});
		});
}

setBackgroundImage( $('.background-imgr') );