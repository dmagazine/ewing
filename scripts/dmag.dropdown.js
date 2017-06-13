/* 
#DROPDOWNS
//////////////////////////////////////////////////////
* modified from: http://codepen.io/Tombek/pen/OPvpLe
*/
(function($) {

	DMAG.dropdown = {
		$dropdowns: null,
		openClass: 'open',
		selectClass: 'selected',

		init: function(){
			var self = this;
			self.$dropdowns = $('.dropdown');
			self.eventHandler();
			self.preSelected();
		},
		activeInToc: function(activeSection) {
			var self = this;
			var $dropdownItem = self.$dropdowns.find('a[data-scrollto="' + activeSection + '"]');
			self.$dropdowns.find('li a').removeClass('is-active');
			
			if ($dropdownItem.length) {
				$dropdownItem.addClass('is-active');
				self.$dropdowns.find('.dropdown__title span').text($dropdownItem.text());
			}
		},
		preSelected: function() {
			var self = this;
			var $selected = self.$dropdowns.find('.dropdown__content ul li.selected');
			var $dropdown = $selected.parents('.dropdown');
			var $input = $dropdown.find('input');
			var $title = $selected.parents('.dropdown').find('.dropdown__title span');
			$title.html($selected.html());
			$input.val($selected.attr('data-value'));
		},
		eventHandler: function(){
			var self = this;

			// Opening a dropdown
			self.$dropdowns.find('.dropdown__title').click(function(){
				self.$dropdowns.removeClass(self.openClass);
				$(this).parents('.dropdown').addClass(self.openClass);
			});

			// Click on a dropdown list
			self.$dropdowns.find('.dropdown__content ul li a').click(function(){
				var $that = $(this);
				var $dropdown = $that.parents('.dropdown');
				var $input = $dropdown.find('input');
				var $title = $(this).parents('.dropdown').find('.dropdown__title span');
				var $slug = $that.attr('data-slug');
				var $titleSlug = $(this).parents('.dropdown').find('.dropdown__title').attr('data-slug');

				// add string to dropdownsearch object based on what value was clicked (used in issue archive search)
				DMAG.$dropdownSearch[$titleSlug] = $slug;
				// add value to hidden form element based on what value was clicked (used in directory search)
				// need to clear values first so doesnt keep previous value if new click is null
				$('.js-directory-' + $titleSlug).attr('value', '');
				$('.js-directory-' + $titleSlug).attr('value', $slug);

				// Remove selected class
				$dropdown.find('.dropdown__content a').each(function(){
					$(this).removeClass(self.selectClass);
				});

				// Update selected value
				$title.html($that.html());
				$input.val($that.attr('data-value')).trigger('change');

				// If back to default, remove selected class else addclass on right element
				if($that.hasClass('dropdown__header')){
					$title.removeClass(self.selectClass);
					$title.html($title.attr('data-title'));
				}
				else{
					$title.addClass(self.selectClass);
					$that.addClass(self.selectClass);
				}

				// Close dropdown
				$dropdown.removeClass(self.openClass);
			});

			// Close all dropdown onclick on another element
			$(document).bind('click', function(e){
					if (! $(e.target).parents().hasClass('dropdown')){ self.$dropdowns.removeClass(self.openClass); }
			});
		}
	};


	DMAG.archiveSearchButton = {
		init: function() {
			$('.js-archive-search').click(function() {
				$publication = DMAG.$dropdownSearch['publication'] ? DMAG.$dropdownSearch['publication'] + '/' : null;
				$year = DMAG.$dropdownSearch['year'] ? DMAG.$dropdownSearch['year'] + '/' : null;
				$url = '/publications/';

				if ($publication == null) {
					$('.w-search__error-message').removeClass('is-hidden');
				} else {
					if ($year == null) {
						$url += $publication;
					} else {
						$url += $publication + $year;
					}

					location.href = $url;
				}


				
			});
		}
	};

})(jQuery);