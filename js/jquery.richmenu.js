(function($) {
	$.fn.richMenu = function(settings) {
		return this.each(function() {
			var $this = $(this);
			var timer;

			var options = {
				events: settings.events || 'click', // trigger event click, mousemove, mousedown, touchstart, touchmove
				effect: settings.effect || 'slide', // jquery animation effect either slide or fade
				target: settings.target || null, // tagert element to be used as the menu content
				timeout: settings.timeout || 500, // time out value for hiding the menu
				speed: settings.speed || 'fast', // menu animation speed
				position: settings.position || 'bottom', // menu position relative to the triggering element
				onBefore: settings.onBefore || function() {}, // function to executer before
				onEnd: settings.onEnd || function() {}, // function to execute after
				onClick: settings.onClick || function() {} // function to execute when the trigger element is clicked on
			};

			target = function() {
				var target = options.target;
				return target && target.jquery ? target : $(target);
			};

			var $target = target();

			$target.hide();

			var $menu = $target.clone(true)
				.data('menuLock', 1)
				.appendTo('body');

			function setMenuPosition(){
				switch (options.position) {
				case 'bottom':
					$menu.css({display: 'none', position: 'absolute', left: $this.offset().left, top: $this.offset().top + $this.height(), zIndex: 5000});
					break;
				case 'top':
					$menu.css({display: 'none', position: 'absolute', left: $this.offset().left, top: $this.offset().top - $menu.height(), zIndex: 5000});
					break;
				case 'left':
					$menu.css({display: 'none', position: 'absolute', right: $this.offset().left + $this.width(), top: $this.offset().top, zIndex: 5000});
					break;
				case 'right':
					$menu.css({display: 'none', position: 'absolute', left: $this.offset().left + $this.width(), top: $this.offset().top + $this.height(), zIndex: 5000});
					break;
				}
			}

			setMenuPosition();

			$(window)
				.resize(function() {
				setMenuPosition();
			});


			function hideMenu(elm) {
				if (typeof elm == 'number') elm = undefined;
				var $elm = $(elm);

				clearTimeout(timer);
				if ($elm.css('display') != 'none') {
					$elm.removeClass('richMenuActive');
					switch (options.effect) {
					case 'slide':
						$elm.slideUp(options.speed);
						break;
					case 'fade':
						$elm.fadeOut(options.speed);
						break;
					};
				}
			};

			function handleUserEvent() {
				if ($this.data('animating')) {
					return false;
				}

				animateMenu();
				return false;
			}

			function animateMenu() {
				$this.data('animating', 1);

				$menu.queue(function() {
					$('.richMenuActive')
						.each(function(index, elm) {
						//	hideMenu($(elm));
					});
					options.onBefore($menu, this);
					$menu.dequeue();
				});
				if ($menu.css('display') == 'none') {
					$menu.addClass('richMenuActive');
					switch (options.effect) {
					case 'slide':
						$menu.slideDown(options.speed);
						break;
					case 'fade':
						$menu.fadeIn(options.speed);
						break;
					};
				} else {
					if (options.events == 'click') {
						hideMenu($menu);
					}
				}

				$menu.queue(function() {
					options.onEnd($menu, $this);
					$this.removeData('animating');
					$menu.dequeue();
				});
			}

			function handleMenuClick(event) {
				options.onClick(this, $menu, $this, event);
				hideMenu($menu);
				event.stopPropagation();
			}


			$menu.mouseenter(function() {
				$menu.css({
					zIndex: 5000
				});
				clearTimeout(timer);
			});

			$menu.mouseleave(function() {
				$menu.css({
					zIndex: 4999
				});
				clearTimeout(timer);
				timer = setTimeout(function() {
					hideMenu($menu);
				}, options.timeout);
				timer
			});

			$this.mouseenter(function() {
				$menu.css({
					zIndex: 5000
				});
				clearTimeout(timer);
			});

			$this.mouseleave(function() {
				$menu.css({
					zIndex: 4999
				});
				clearTimeout(timer);
				timer = setTimeout(function() {
					hideMenu($menu);
				}, options.timeout);
				timer
			});

			function bindMenu(elm) {
				$(elm)
					.bind('click', handleMenuClick, false);
				$(elm)
					.children()
					.each(

				function() {
					bindMenu($(this));
				});

			}

			$this.bind($.trim((options.events + ' ')
				.split(' ')
				.join('.newmenu ')), handleUserEvent);
			bindMenu($menu);
		});
	};
})(jQuery);
