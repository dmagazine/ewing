(function($) {

	DMAG.$nav = $('.nav').length !== 0 ? $('.nav') : $('.js-nav');
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
		large: 1024,
		small: 580
	};

	DMAG.breakpoint_large_only = "screen and (min-width:" + DMAG.dScreen.large + "px)";
	DMAG.breakpoint_large_medium = "screen and (min-width:" + DMAG.dScreen.small + "px)";
	DMAG.breakpoint_medium_small = "screen and (max-width:" + DMAG.dScreen.large + "px)";
	DMAG.breakpoint_medium_only = "screen and (max-width:" + DMAG.dScreen.large + "px) and (min-width:" + DMAG.dScreen.small + "px)";
	DMAG.breakpoint_small_only = "screen and (max-width:" + DMAG.dScreen.small + "px)";

	DMAG.isSmallScreen = function() {
		return DMAG.dScreen.small >= window.innerWidth;
	}
	DMAG.isMediumScreen = function() {
		return DMAG.dScreen.large >= window.innerWidth;
	}

	window.$loadingOverlay = $('.is-loading-overlay');
	window.loadingOverlayShow = function() {
		$loadingOverlay.removeClass('is-hidden');
	};
	window.loadingOverlayHide = function() {
		$loadingOverlay.addClass('is-hidden');
	};

	DMAG.imageApiConversion = function(image, width, height) {
		// these urls redirect to umbraco assets.dmagazine.com
		if ( (image.indexOf('dmagazine.com') !== -1) && (image.indexOf('media') !== -1)) {
			image = image + '?mode=crop-up&width=' + width + '&height=' + height;

		// missellie urls (find url with appended smaller dimensions)
		} else if (image.indexOf('www.dmagazine.com') !== -1) {
			// the slice cuts off the .png, .jpg, .gif etc at the end of the url
			thumbnail_start = image.slice(0, -4);
			thumbnail_end = image.slice(-3);
			
			// some minimizing image plugin that was activated and then deactivated at some point on missellie messed with the image output, have to account for those.
			// these images all end in -e#### so we have to strip that part out to get the original image before adding the crop dimensions to the url
			// regex expression reads: 'find -e string' (-e), followed by any number ([0-9]), or repeating string of numbers (+), at the end of the string ($)
			if (/-e[0-9]+$/.test(thumbnail_start)) {
				thumbnail_start = thumbnail_start.replace(/-e[0-9]+$/, "");
			}

			image = thumbnail_start + '-243x160.' + thumbnail_end;

		// umbraco urls (use crop-up to get smaller image)
		} else if (image.indexOf('dmagazine.com') !== -1) {
			image = image;
		} else if (image.match(/^(http|https):\/\//)) {
			image = '//assets.dmagazine.com/remote/'+image.replace(/(http|https):\/\//,'')+'?mode=crop-up&width=' + width + '&height=' + height;
		} else if (image) {
			image = '//assets.dmagazine.com'+image+'?mode=crop-up&width=' + width + '&height=' + height;
		} else {
			image = null;
		}

		return image;
	};

	DMAG.imageSizing = function(image, size) {
		if (!image) { return; }

		$is_subdomain = image.indexOf('//dmagazine.com') == -1 && image.indexOf('www.dmagazine.com') == -1;
		$is_old = image.indexOf('/uploads/media/') != -1;

		if ($is_old || $is_subdomain) {
			return image;
		} else {
			var pos = image.lastIndexOf('.');
			// the slice cuts off the .png, .jpg, .gif, .tiff, .jpeg etc at the end of the url
			image_start = image.slice(0, pos);
			image_end = image.slice(pos + 1);
			return image_start + '-330x220.' + image_end;
		}

	};

	DMAG.getURLParams = function() {
		URLParams = window.location.search.slice(1);
		URLParams = URLParams.split('&');

		params = {};

		for(i = 0; i < URLParams.length; i++) {
			URLParam = URLParams[i];
			URLParam = URLParam.split('=');
			params[URLParam[0]] = decodeURIComponent(URLParam[1]);
		}

		return params;
	};

})(jQuery);