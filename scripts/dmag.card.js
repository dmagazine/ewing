/* 
#CARD
//////////////////////////////////////////////////////
*/
(function($) {

	DMAG.card = {
		init: function() {
			$('.js-block').hover(function() {
				$cardElement = $(this).find('.js-block-element');
				$cardElement.toggleClass('is-active');
			});
		}
	};

})(jQuery);