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
			if (whenLiveElements[ek]['selector']) {
				if (container.className.indexOf(whenLiveElements[ek]['selector']) >= 0) {
					var attached = container.getAttribute('attached');
					if (!attached) {
						if ( whenLiveElements[ek].options.visibility && isVisible(container) ) {
							container.setAttribute('attached', '1');
							whenLiveElements[ek]['fn'](container);
						} else {
							container.setAttribute('attached', '1');
							whenLiveElements[ek]['fn'](container);
						}
					}
				} else {
					var class_els = getElementsByClassName(container, whenLiveElements[ek]['selector']);
					for (var i = 0; i< class_els.length; i++) {
						var attached = class_els[i].getAttribute('attached');
						if (!attached) {
							if (whenLiveElements[ek].options.visibility) {
								if (isVisible(class_els[i])) {
									class_els[i].setAttribute('attached', '1');
									whenLiveElements[ek]['fn'](class_els[i]);
								}
							} else {
								class_els[i].setAttribute('attached', '1');
								whenLiveElements[ek]['fn'](class_els[i]);
							}
						}
					}
				}
			} else {
				if ( container.contains(whenLiveElements[ek]['elem']) || container === whenLiveElements[ek]['elem'] ) {
					// The element exists within the DOM
					if ( whenLiveElements[ek].options.visibility ) {
						// User has requested that we also check for visibility.
						if ( isVisible(whenLiveElements[ek]['elem']) ) {
							// It's visible.
							whenLiveElements[ek].fn(whenLiveElements[ek].elem);
							whenLiveElements.splice(ek);
						} else {
						}
					} else {
						whenLiveElements[ek].fn(whenLiveElements[ek].elem);
						whenLiveElements.splice(ek);
					}
				}
			}
		}
	};

	var getElementsByClassName = function(node,classname) {
		if (node.getElementsByClassName) { // use native implementation if available
			return node.getElementsByClassName(classname);
		} else {
			return (function getElementsByClass(searchClass,node) {
				if ( node == null ) {
					node = document;
					var classElements = [],
					els = node.getElementsByTagName("*"),
					elsLen = els.length,
					pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;
					for (i = 0, j = 0; i < elsLen; i++) {
						if ( pattern.test(els[i].className) ) {
							classElements[j] = els[i];
						j++;
						}
					}
				}
				return classElements;
			})(classname, node);
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

		if ( typeof el === 'string' ) {
			var els = getElementsByClassName(document.body, el);
			for (var i = 0; i < els.length; i++) {
				var attached = els[i].getAttribute('attached');
				if (!attached) {
					if (options.visibility) {
						if (isVisible(els[i])) {
							els[i].setAttribute('attached', '1');
							fn(els[i]);
						}
					} else {
						els[i].setAttribute('attached', '1');
						fn(els[i]);
					}
				}
			}
			whenLiveElements.push({
				'elem': null,
				'fn': fn,
				'options': options,
				'selector': el
			});
			if ( !MutationObserver ) {
				if ( whenLiveElements.length === 1 ) {
					requestAnimationFrame(whenLiveLoop);
				}
			}
		} else if ( document.documentElement.contains(el) ) {
			// The element exists within the DOM
			if ( options.visibility ) {
				if ( isVisible(el) ) {
					fn();
				} else {
					whenLiveElements.push({
						'elem': el,
						'fn': fn,
						'options': options,
						'selector': null
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
				'options': options,
				'selector': null
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
