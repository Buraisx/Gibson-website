/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		header = document.querySelector( '.navbar-fixed-top' ),
		didScroll = false,
		changeHeaderOn = 300;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		$(function() {
	        $(window).scroll(function(){
                if ($(this).scrollTop() > 300) {
                	$('.navbar-default').addClass('navbar-shrink');
                }
                else {
                    $('.navbar-default').removeClass('navbar-shrink');
                }
            });
        });
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();