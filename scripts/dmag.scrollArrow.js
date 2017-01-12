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

	DMAG.scrollToc = {
		init: function() {
			$(".js-scrollToc a").click(function(e) {
				e.preventDefault();
				$('html, body').animate({
					scrollTop: $("."+$(this).data("scrollto")).offset().top - DMAG.$spaceTop
				}, 900);
				$('.js-scrollArrow').css('display', 'block');
			});
		},
	};

})(jQuery);