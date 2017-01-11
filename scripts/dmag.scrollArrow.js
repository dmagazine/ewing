(function($) {

	DMAG.scrollArrow = {
		init: function() {
			$('.js-scrollArrow').click(function() {
				$('html, body').animate({
					scrollTop: $('.js-scrollOffset').offset().top
				}, 900);
			});
		}
	};

	DMAG.scrollToc = {
		init: function() {
			$(".js-scrollToc a").click(function(e) {
				e.preventDefault();
				enquire.register(DMAG.breakpoint_large_medium, function() {
					$('html, body').animate({
						scrollTop: $("."+$(this).data("scrollto")).offset().top - DMAG.$nav_height + 10
					}, 900);
				});
				enquire.register(DMAG.breakpoint_small_only, function() {
					$('html, body').animate({
						scrollTop: $("."+$(this).data("scrollto")).offset().top - 10
					}, 900);
				});
			});
		}
	};

})(jQuery);