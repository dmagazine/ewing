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
			$spaceTop = DMAG.isMediumScreen() ? 10 : DMAG.$nav_height + 10;
			$(".js-scrollToc a").click(function(e) {
				e.preventDefault();
				$('html, body').animate({
					scrollTop: $("."+$(this).data("scrollto")).offset().top - $spaceTop
				}, 900);
			});
		}
	};

})(jQuery);