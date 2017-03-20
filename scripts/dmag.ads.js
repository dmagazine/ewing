/* 
#ADS
//////////////////////////////////////////////////////
* Ripped off of jquery.dfp.js: http://github.com/coop182/jquery.dfp.js
* but w/ some inspiration from http://motherboard.vice.com/en_us
*/
(function($) {

	DMAG.dfpAds = {
		count: 0,
		rendered: 0,
		initial_ads_loaded: false,
		ajax_ads_queue: [],
		dfp_is_loaded: false,
		dfp_is_started: false,
		ads_could_never_be_initilized: false,
		ad_blocker: false,
		ads: [],
		$adCollection: null,
		/**
		 * Call the google DFP script - there is a little bit of error detection in here to detect
		 * if the dfp script has failed to load either through an error or it being blocked by an ad
		 * blocker... if it does not load we execute a dummy script to replace the real DFP.
		 *
		 * @param {Object} options
		 * @param {Array} $adCollection
		 */
		dfp_loader: function() {
			DMAG.dfpAds.dfp_is_loaded = DMAG.dfpAds.dfp_is_loaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
			// if (DMAG.dfpAds.dfp_is_loaded) {
			// 	if (ads_could_never_be_initilized) {
			// 		execBlockEvent()
			// 	}
			// }
			window.googletag = window.googletag || {};
			window.googletag.cmd = window.googletag.cmd || [];
			(function(){
				var gads = document.createElement('script');
				gads.async = true;
				var useSSL = 'https:' == document.location.protocol;
				gads.src = (useSSL ? 'https:' : 'http:') +
				   '//www.googletagservices.com/tag/js/gpt.js';
				var node = document.getElementsByTagName('script')[0];
				node.parentNode.insertBefore(gads, node);
			})();

		},

		get_url_targeting: function() {
			// Get the paths for targeting against
			var paths = window.location.pathname.replace(/\/$/, ''),
				patt = new RegExp('\/([^\/]*)', 'ig'),
				pathsMatches = paths.match(patt),
				targetPaths = ['/'],
				longestpath = '';

			if (pathsMatches && paths !== '/') {
				var target = '',
					size = pathsMatches.length;
				if (size > 0) {
					for (var i = 0; i < size; i++) {
						target = pathsMatches[i];
						targetPaths.push(target);
						for (var j = i + 1; j < size; j++) {
							target += pathsMatches[j];
							targetPaths.push(target);
						}
						if (i === 0) {
							targetPaths.splice(-1, 1);
							longestpath = target;
						}
					}
				}
				targetPaths.push(longestpath);
			}

			targetPaths = targetPaths.reverse();

			// Get the query params for targeting against
			var url = window.location.toString().replace(/\=/ig, ':').match(/\?(.+)$/),
				params = RegExp.$1.split('&');


			// url targeting from bobby2 (above from jquery.dfp.js)
			var pathname = location.pathname.split('/');
			var url2 = pathname[pathname.length - 2];
			url2 = url2.split(/[\s,./\-]+/).join('-');


			return {
				inURL: targetPaths,
				URLIs: targetPaths[0],
				Query: params,
				url2: url2
			};

		},

		// generate random number based ID
		get_ID: function(adSlot, count) {
			for (var c = "", d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", e = 14; e > 0; --e) {
				c += d[Math.round(Math.random() * (d.length - 1))];
				return adSlot + "-" + c + "-" + Date.now() + "-" + count;
			}
		},
		// get name of adunit based on data-adunit in html
		get_name: function($adUnit) {
			var adUnitName = $adUnit.data('adunit');
			return adUnitName;
		},

		// get adunit mapping based on data-mapping in html
		get_mapping: function($adUnit) {
			var adUnitMapping = $adUnit.data('mapping');
			return adUnitMapping;
		},

		init: function() {
			var self = this;
			self.$adCollection = $('.adunit:not(.adunit-loaded)');
			this.dfp_loader();
			this.create_ads();
			// this.display_ads();
		},

		refresh: function() {
			var self = this;
			self.$adCollection = $('.adunit:not(.adunit-loaded)');
			this.create_ads();
		},

		ad_targeting_sizes: {
			mapping_horizontal: function() {
				return window.googletag.sizeMapping()
				.addSize([980, 1], [
					[970, 250],
					[728, 90]
				]).addSize([740, 1], [
					[728, 90]
				]).addSize([0, 1], [
					[300, 250] 
				]).build();
			},
			// mapping_horizontal_top: function() {
			// 	return window.googletag.sizeMapping()
			// 	.addSize([980, 1], [
			// 		[970, 250],
			// 		[728, 90]
			// 	]).addSize([740, 1], [
			// 		[728, 90]
			// 	]).addSize([0, 1], [
			// 		[320, 50]
			// 	]).build();
			// },
			mapping_horizontal_slideshow: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 1], [
					[300, 250]
				]).build();
			},
			mapping_horizontal_desktop: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 0], [
				]).addSize([1024, 1], [
					[970, 250],
					[728, 90]
				]).addSize([740, 1], [
					[728, 90]
				]).build();
			},
			// hide on desktop
			// on mobile show the 300x250 adunit
			mapping_horizontal_mobile: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 0], [
					[300, 250]
				])
				.addSize([1024, 1], [])
				.build();
			},
			// hide on desktop
			// on mobile show the 320x50 adunit
			mapping_horizontal_mobile_top: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 0], [
					[320, 50]
				])
				.addSize([1024, 1], [])
				.build();
			},
			// mapping for vertical ads that are hidden
			// on mobile / tablet views (anything below 1024px wide)
			mapping_vertical_desktop: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 0], [])
				.addSize([1024, 1], [
					[300, 600],
					[300, 250]
				])
				.build();
			},
			mapping_vertical_top: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 0], [])
				.addSize([1024, 1], [
					[300, 150],
					[300, 251]
				])
				.build();
			},
			mapping_vertical: function() {
				return window.googletag.sizeMapping()
				.addSize([1024, 1], [
					[300, 600],
					[300, 250]
				]).addSize([740, 1], [
					[728, 90]
				]).addSize([0, 1], [
					[300, 250], 
				]).build();
			},
			mapping_interstitial: function() {
				return window.googletag.sizeMapping()
				.addSize([0, 1], [
					[1, 1]
				]).build();
			}
		},
		ad_slots: {
			MissEllie_horizontal: {
				dimensions: [
					[970, 250],
					[728, 90], 
					[300, 250]
				],
				targeting_sizes: "mapping_horizontal",
			},
			MissEllie_horizontal_top: {
				dimensions: [
					[970, 250],
					[728, 90], 
					[320, 50]
				],
				targeting_sizes: "mapping_horizontal",
			},
			MissEllie_vertical: {
				dimensions: [
					[300, 600],
					[300, 250],
					[728, 90],
					[300, 250]
				],
				targeting_sizes: "mapping_vertical",
			},
			MissEllie_vertical_top: {
				dimensions: [
					[300, 150],
					[300, 251]
				],
				targeting_sizes: "mapping_vertical_top",
			},
			MissEllie_vertical_bottom: {
				dimensions: [
					[300, 600],
					[300, 250],
					[728, 90],
					[300, 250]
				],
				targeting_sizes: "mapping_vertical",
			},
			MissEllie_interstitial: {
				dimensions: [
					[1, 1]
				],
				targeting_sizes: "mapping_interstitial",
			},
		},
		config: {
			dfp_account: "1039436",
			ad_unit: "",
			googletag: false,
			targeting: {},
			dfp_options: {
				set_category_exclusion: [],
				// set_location: false,
				enable_single_request: true,
				collapse_empty_divs: true,
				set_url_targeting: true,
				disable_publisher_console: false,
				disable_initial_load: true,
				no_fetch: false
			},
			callbacks: {
				after_all_ads_loaded: false
			}
		},

		_configure_dfp: function() {
			DMAG.dfpAds.dfp_is_started = true;
			window.googletag.cmd.push(function() {

				if (DMAG.dfpAds.config.dfp_options.set_url_targeting) {
					var urlTargeting = DMAG.dfpAds.get_url_targeting();
					$.extend(true, DMAG.dfpAds.config.dfp_options.set_url_targeting, {
						inURL: urlTargeting.inURL,
						URLIs: urlTargeting.URLIs,
						Query: urlTargeting.Query,
						url2: urlTargeting.url2
					});
				}

				DMAG.dfpAds.config.dfp_options && window.googletag.cmd.push(function() {
					$.extend(true, window.googletag, DMAG.dfpAds.config.googletag)
				});

				DMAG.dfpAds.config.dfp_options.collapse_empty_divs && 
					window.googletag.pubads().collapseEmptyDivs(); 

				var targeting = $.extend({}, window.dfp_targeting, urlTargeting);

				$.each(targeting, function (k, v) {
					window.googletag.pubads().setTargeting(k, v);
				});

				DMAG.dfpAds.config.dfp_options.disable_publisher_console && 
					window.googletag.pubads().disablePublisherConsole();

				// Infinite Scroll / 'Load More' requires SRA
				DMAG.dfpAds.config.dfp_options.enable_single_request &&
					window.googletag.pubads().enableSingleRequest();

				// Disable initial load, we will use refresh() to fetch ads.
				// Calling this function means that display() calls just
				// register the slot as ready, but do not fetch ads for it.
				DMAG.dfpAds.config.dfp_options.disable_initial_load &&
					window.googletag.pubads().disableInitialLoad();

				DMAG.dfpAds.config.dfp_options.no_fetch && 
					window.googletag.pubads().noFetch();

				googletag.pubads().addEventListener('slotRenderEnded', function(event) {
					DMAG.dfpAds.rendered++;
					var $adUnit = $('#' + event.slot.getSlotId().getDomId());
					var display = event.isEmpty ? 'none' : 'block';

					// if the div has been collapsed but there was existing content expand the
					// div and reinsert the existing content.
					var $existingContent = $adUnit.data('existingContent');
					if (display === 'none' && $.trim($existingContent).length > 0 &&
						dfpOptions.collapseEmptyDivs === 'original') {
						$adUnit.show().html($existingContent);
						display = 'block display-original';
					}

					$adUnit.removeClass('display-none').addClass('display-' + display).addClass('adunit-loaded');

				});

				// Enable services
				window.googletag.enableServices();

			});
		},
		create_ads: function() {

			DMAG.dfpAds._configure_dfp();

			googletag.cmd.push(function() {

			DMAG.dfpAds.$adCollection.each(function() {
				var googletag = window.googletag;

				// create ad for each adunit on page
				var $adUnit = $(this);

				DMAG.dfpAds.count++;

				var adUnitName = DMAG.dfpAds.get_name($adUnit);
				var ID = DMAG.dfpAds.get_ID(adUnitName, DMAG.dfpAds.count);
				adSlot_object = DMAG.dfpAds.ad_slots[adUnitName];

				// hide internal html until adunit finishes rendering
				$adUnit.html('').addClass('display-none');

				// mapping = adSlot_object.targeting_sizes;
				mapping = DMAG.dfpAds.get_mapping($adUnit);
					mappingvar = DMAG.dfpAds.get_mapping($adUnit);
					// mappingvar = adSlot_object.targeting_sizes;
					isMapped = false;

					 // Sets responsive size mapping for just THIS ad unit if it has been specified
					mappingvar && DMAG.dfpAds.ad_targeting_sizes[mapping] && 
						(isMapped = DMAG.dfpAds.ad_targeting_sizes[mappingvar].call()),

					$adUnit.attr('id', ID);

					googleAdUnit = googletag.defineSlot(
						'/' + DMAG.dfpAds.config.dfp_account +'/' + adUnitName,
						adSlot_object.dimensions,
						ID
					)
					.defineSizeMapping(isMapped)
					.addService(googletag.pubads());


					googletag.cmd.push(function() {
						googletag.display(ID);
						googletag.pubads().refresh([googleAdUnit]);
					});
				});
			});

		},
		/*
		Inject ads between paragraphs on mobile and story pages w/o sidebar
		*/
		inject_ads: function() {
			$('.layout--full-width .story__content p:nth-child(10n)').each(function() {
				if ( $(this).nextAll().length > 3 && $(this).text().length > 30 ) {
				// if the last injected ad has 3 or fewer paragraphs after it, don't show
					$(this).after('<div class="adunit adunit--horizontal" data-adunit="MissEllie_horizontal" data-mapping="mapping_horizontal"></div>');
				};
			});
			enquire.register(DMAG.breakpoint_small_only, function() {
				$('.layout--with-sidebar .story__content p:nth-child(7n)').each(function() {
					if ( $(this).nextAll().length > 3 && $(this).text().length > 30 ) {
					// if the last injected ad has 3 or fewer paragraphs after it, don't show
						$(this).after('<div class="adunit adunit--horizontal" data-adunit="MissEllie_horizontal" data-mapping="mapping_horizontal"></div>');
					};
				});
			});
		},

		/*
		sticky scrolling behavior for header and sidebars
		- sidebar ads are sticky until they hit the top of a widget
		- only for sidebar ads on stories w/ sidebar layout
		- plugin: scrolltofixed, https://github.com/bigspotteddog/ScrollToFixed
		*/
		sticky_ads: function() {
			if ($('.js-stickyStop').length > 0) {
				var $padding = 10;
				var $marginTop = DMAG.$nav_height + $padding;
				var $sidebarAd = $('.layout--with-sidebar .js-sticky:not(.scroll-to-fixed-fixed)');

				$sidebarAd.each(function(){
					$this = $(this);
					var $ad_height = $this.height();
					var $ad_parent = $this.parents('.js-stickyParent');
					$limit = $ad_parent.next('.js-stickyStop').offset().top - $ad_height - $padding;
					// $limit = $ad_parent.next('.js-stickyStop');
					// console.log($limit);

					if ( $ad_height < $ad_parent.height() ){
						$this.scrollToFixed({
							marginTop: $marginTop,
							zIndex: 200,
							// end sticky action when ad hits widget element
							// limit is calculated from the top of ad element
							// translation: (widget offset) - (ad height) - (padding)
							limit: $limit,
							// removes left and top position added by plugin while sticky, 
							// once sidebar is back to absolute position
							removeOffsets: true,
							// becasue ad is below another element in the sidebar (sidebar widget), 
							// have to account for that element's height
							preAbsolute: function() {
								$this.css('marginTop', $this.siblings('.js-stickySibling').height() + 'px');
							},
							postAbsolute: function() {
								$this.css('marginTop', 0);
							}
						}); //scrolltofixed
					} //endif

				}); //each
			};
		},
	}; // DMAG.dfpAds

})(jQuery);
