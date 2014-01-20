define([], function() {

	var whenLiveInit = false,
		whenLiveElements = [],
		whenLiveLoop;

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var isVisible = function(el) {
		if ( el.offsetWidth > 0 && el.offsetHeight > 0 ) {
			return true;
		}
		return false;
	};

	var checkElements = function(container) {
		if ( !container ) {
			container = document.documentElement;
		}
		for ( var ek in whenLiveElements ) {
			if ( container.contains(whenLiveElements[ek]['elem']) || container === whenLiveElements[ek]['elem'] ) {
				// The element exists within the DOM
				if ( whenLiveElements[ek].options.visibility ) {
					// User has requested that we also check for visibility.
					if ( isVisible(whenLiveElements[ek]['elem']) ) {
						// It's visible.
						whenLiveElements[ek].fn.call(whenLiveElements[ek].elem);
						whenLiveElements.splice(ek);
					} else {
					}
				} else {
					whenLiveElements[ek].fn.call(whenLiveElements[ek].elem);
					whenLiveElements.splice(ek);
				}
			}
		}
	};

	if ( MutationObserver ) {

		var observer = new MutationObserver(function(mutations) {
			for ( var mi = 0; mi < mutations.length; mi++ ) {
				var mutation = mutations[mi];
				checkElements(mutation.target);
				if ( whenLiveElements.length ) {
					for ( var ni = 0; ni < mutation.addedNodes.length; ni ++ ) {
						var node = mutation.addedNodes[ni];
						checkElements(node);
					}
				}
			}
		});
		observer.observe(document, {
			'childList': true,
			'subtree': true,
			'attributes': true
		});

	} else {

		/**
		 * requestAnimationFrame polyfill
		 */
		(function() {
			var lastTime = 0;
			var vendors = ['webkit', 'moz'];
			for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame =
				  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
			}
			if (!window.requestAnimationFrame)
				window.requestAnimationFrame = function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					  timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
		}());
		// /polyFill

		whenLiveLoop = function() {
			checkElements();
			if ( whenLiveElements.length > 0 ) {
				requestAnimationFrame(whenLiveLoop);
			}
		};

	}

	var whenLive = function(el, options, fn) {

		if ( typeof options === 'function' ) {
			fn = options;
			options = {};
		} else if ( typeof options !== 'object' ) {
			options = {};
		}

		if ( typeof options.visibility !== 'boolean' ) {
			options.visibility = false;
		}

		if ( typeof fn !== 'function' ) {
			return;
		}

		if ( document.documentElement.contains(el) ) {
			// The element exists within the DOM
			if ( options.visibility ) {
				if ( isVisible(el) ) {
					fn();
				} else {
					whenLiveElements.push({
						'elem': el,
						'fn': fn,
						'options': options
					});
					if ( !MutationObserver ) {
						if ( whenLiveElements.length === 1 ) {
							requestAnimationFrame(whenLiveLoop);
						}
					}
				}
			} else {
				fn();
			}
		} else {
			// The element is outside of the DOM
			whenLiveElements.push({
				'elem': el,
				'fn': fn,
				'options': options
			});
			if ( !MutationObserver ) {
				if ( whenLiveElements.length === 1 ) {
					requestAnimationFrame(whenLiveLoop);
				}
			}
		}

	};

	return whenLive;

});
