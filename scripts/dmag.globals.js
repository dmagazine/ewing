(function($) {

	DMAG.$nav = $('.nav');
	DMAG.$nav_height = DMAG.$nav.outerHeight();
	DMAG.$body = $('body');
	DMAG.$html = $('html');
	DMAG.$dropdownSearch = {};

	/*
	Breakpoints
	THERE ARE ALSO SEPERATELY MAINTINAED JS AND PHP BREAKPOINTS, 
	- mixins-master.scss
	- class-constants.php
	*/
	DMAG.dScreen = {
		large: '1024px',
		small: '580px'
	};

	DMAG.breakpoint_large_only = "screen and (min-width:" + DMAG.dScreen.large + ")";
	DMAG.breakpoint_large_medium = "screen and (min-width:" + DMAG.dScreen.small + ")";
	DMAG.breakpoint_medium_small = "screen and (max-width:" + DMAG.dScreen.large + ")";
	DMAG.breakpoint_medium_only = "screen and (max-width:" + DMAG.dScreen.large + ") and (min-width:" + DMAG.dScreen.small + ")";
	DMAG.breakpoint_small_only = "screen and (max-width:" + DMAG.dScreen.small + ")";

	window.$loadingOverlay = $('.is-loading-overlay');
	window.loadingOverlayShow = function() {
		$loadingOverlay.removeClass('is-hidden');
	};
	window.loadingOverlayHide = function() {
		$loadingOverlay.addClass('is-hidden');
	};

})(jQuery);