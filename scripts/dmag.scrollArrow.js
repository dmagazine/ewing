(function($) {

	DMAG.dataTable = {
		init: function() {
			$('.js-scrollArrow').click(function() {
				$('html, body').animate({
					scrollTop: $('.js-scrollOffset').offset().top
				}, 900);
			});
		}
	}

})(jQuery);