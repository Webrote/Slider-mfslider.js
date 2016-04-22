/* =======================================
 * Small adaptive slider mfSlider
 * v.1.0
 * author D.K.
 * ======================================*/
(function ($) {
	$.fn.mfslider = function (options) {
		function getPrefix(el) {
			var prefixes = ["Webkit", "Moz", "O", "ms"];
			for (var i = 0; i < prefixes.length; i++) {
				if (prefixes[i] + "Transition" in el.style) {
					return '-'+prefixes[i].toLowerCase()+'-';
				};
			};
			return "transition" in el.style ? "" : false;
		};
		var defaults = {
			transition: 'fade', // horizontal, verticale
			animationTime: 500,
			autoplay: true,
			autoplayTime: 3000,
			arrows: true,
			arrowsHide:true,
			slideSelector: '.slide',
			pagination: true,
			pauseOnHover: true,
		};
		var sets = $.extend({},defaults,options);

		var _this = $(this),
			slides = _this.find(sets.slideSelector),
			activeSlide,
			newSlide,
			totalSlides = slides.length,
			arrows,
			pagers,
			pager,
			play,
			isAnimation = false,
			prefix = getPrefix(_this[0]);
		console.log(prefix);

		return this.each(function () {
			var slider = {
				init: function () {
					slider.data();
					if (sets.arrows) {
						slider.arrows.create()
					}
					if (sets.pagination) {
						slider.pagination.create()
					}
					if (sets.autoplay) {
						slider.autoplay()
					}
					slider.triggers()
				},
				data: function () {
					slides.eq(0).css('opacity', 1);
					activeSlide = 0;
				},
				cleanUp: function () {
					slides.eq(activeSlide).removeAttr('style');
					activeSlide = newSlide;
					isAnimation = false;
				},
				slide: {
					prev: function () {
						switch (sets.transition) {
							case "horizontal":
								break;
							case "vertical":
								break;
							case "fade":
								newSlide = (activeSlide == 0) ? totalSlides-1 : activeSlide - 1;
								slider.animation();
								break;
						}
					},
					next: function () {
						switch (sets.transition) {
							case "horizontal":
								break;
							case "vertical":
								break;
							case "fade":
								newSlide = (activeSlide == totalSlides-1) ? 0 : activeSlide + 1;
								slider.animation();
								break;
						}
					}
				},
				animation: function () {
					if (isAnimation) return false;
					isAnimation = true;
					switch (sets.transition) {
						case "fade":
							slides.eq(activeSlide).css('z-index', 3);
							slides.eq(newSlide).css({
								'z-index': 2,
								'opacity': 1
							});
							if (!prefix) {
								slides.eq(activeSlide).animate({'opacity': 0}, sets.animationTime, slider.cleanUp);
							} else {
								var styles = {};
								styles[prefix+'transition'] = 'opacity '+sets.animationTime+'ms';
								styles['opacity'] = 0;
								slides.eq(activeSlide).css(styles);
								var animTimer = setTimeout(function () {
									slider.cleanUp();
								},sets.animationTime);
							};
							break;
					}
				},
				pause: function () {
					clearInterval(play)
				},
				autoplay: function () {
					play = setInterval(function () {
						slider.slide.next();
						if (sets.pagination) {
							slider.pagination.update();
						}
					}, sets.autoplayTime);
				},
				arrows: {
					create: function () {
						_this.append($("<div />").addClass('sliderArrows'));
						arrows = _this.find('.sliderArrows');
						arrows.append($("<div />").addClass("page prev").attr("data-target","prev").text(String.fromCharCode(8249)));
						arrows.append($("<div />").addClass("page next").attr("data-target","next").text(String.fromCharCode(8250)));
					},
					trigger: function () {
						arrows.children().click(function () {
							var target = $(this).attr('data-target');
							switch (target) {
								case "prev":
									slider.slide.prev()
									break
								case "next":
									slider.slide.next()
									break
							}
							if (sets.pagination) {
								slider.pagination.update();
							}
						});
						if (sets.arrowsHide) {
							arrows.hide();
							_this.hover(function () {
								arrows.show()
							},
							function () {
								arrows.hide()
							})
						}
					}
				},
				pagination: {
					create: function () {
						_this.append($("<ul />").addClass('sliderPagers'));
						pagers = _this.find('.sliderPagers');
						for (var i = 0; i < totalSlides; i++) {
							pagers.append($("<li />").addClass('page').attr("data-target", i).text(i));
						};
						pagers.find('li').eq(0).addClass('active');
					},
					trigger: function () {
						pager = pagers.children();
						pager.click(function () {
							newSlide = Number($(this).attr('data-target'));
							if (newSlide == activeSlide) {
								return false;
							}
							slider.pagination.update();
							switch (sets.transition) {
								case "horizontal":
									break;
								case "vertical":
									break;
								case "fade":
									slider.animation();
									break;
							}
						});
					},
					update: function () {
						pagers.children().removeClass('active').eq(newSlide).addClass('active');
					}
				},
				triggers: function () {
					if (sets.arrows) {
						slider.arrows.trigger();
					}
					if (sets.pagination) {
						slider.pagination.trigger();
					}
					if (sets.pauseOnHover) {
						_this.hover(function () {
							slider.pause()
						},
						function () {
							if (sets.autoplay) {
								slider.autoplay()
							}
						})
					};					
				}
			};
			slider.init();
		})
	}
}(jQuery));