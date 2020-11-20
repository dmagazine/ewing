(function($) {

	DMAG.$spaceTop = DMAG.isMediumScreen() ? 10 : DMAG.$nav_height + 10;

	DMAG.scrollArrow = {
		init: function() {
			$('.js-scrollArrow').click(function() {
				$('html, body').animate({
					scrollTop: $('.js-scrollOffset').offset().top - DMAG.$spaceTop
				}, 900);
			});
		}
	};

	DMAG.scrolledPastTop = false;

	DMAG.scrollToc = {

		init: function() {
			$('.js-scroll-to-fixed').scrollToFixed();
			var navHeight = $('.js-scrollToc-nav')[0] ? $('.js-scrollToc-nav').outerHeight(true) : DMAG.$spaceTop;

			window.addEventListener('scroll', _.throttle( function() { DMAG.scrollToc.activeOnScroll() }, 1000));

			$('.js-scrollToc li a').click(function(e) {
				e.preventDefault();

				$('html, body').animate({
					scrollTop: $('.'+$(this).data('scrollto')).offset().top - navHeight
				}, 900);
				$('.js-scrollArrow').css('display', 'block');
			});
		},

		activeOnScroll: function() {
			var scrollPos = $(document).scrollTop();
			var windowHeight = $(window).height();
			var navHeight = $('.js-scrollToc-nav').outerHeight(true);

			$('.js-scrollToc li a').each(function() {
				var currLink = $(this);
				var refElement =  '.' + $(this).data('scrollto');
				refElement =  $(refElement);

				if ( (refElement.offset().top  - navHeight < scrollPos ) && (refElement.offset().top  + refElement.outerHeight(true) - navHeight  >= scrollPos ) ) {
					$('.js-scrollToc li a').removeClass('is-active');
					currLink.addClass('is-active');
					DMAG.dropdown.activeInToc($(this).data('scrollto'));
				} else {
					currLink.removeClass('is-active');
				}

			});

			if (scrollPos > windowHeight && !DMAG.scrolledPastTop) {
				$('body').addClass('is-scrolled');
				DMAG.scrolledPastTop = true;
			}
		}

	};


})(jQuery);
