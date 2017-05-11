/* 
#SLIDER (NAVIGATION)
//////////////////////////////////////////////////////
*/
(function($) {

	DMAG.$slideTrigger = $('.js-slide-trigger');

	DMAG.slider = {
		init: function() {
			// DMAG.$nav.scrollToFixed({});

			DMAG.$slideTrigger.on('click', function() {
				DMAG.slider.addBodyClass();
				DMAG.slider.switchIcons();
				// DMAG.$nav.trigger('detach.ScrollToFixed');
			});
		}, 
		addBodyClass: function() {
			DMAG.$html.toggleClass('is-slider-open');
		}, 
		switchIcons: function() {
			DMAG.$slideTrigger.find('.js-slide-switch').toggleClass('is-hidden');
		}
	};

	/*
	#SEARCH
	*/
	DMAG.navSearch = {
		init: function() {
			var inputShown = false;
			$('.js-searchButton').click(function() {
				$('.js-searchInput').focus();
				if ( $('.js-searchInput').val() ) {
					inputShown = true;
				}

				if (!inputShown) {
					$('.js-searchForm').toggleClass('is-active');
				} else {
					$('.js-searchForm').submit();
				}
			});
		}
	};
})(jQuery);





