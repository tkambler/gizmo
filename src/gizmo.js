define([
	'require',
	'./lib/deferred',
	'./lib/microevent',
	'./lib/lodash.underscore',
	'./lib/whenlive',
	'./lib/utils',
	'./lib/extend'
], function(require, Deferred, MicroEvent, _, whenLive, utils, Class) {

	var instances = [],
		checkingInstances = false,
		checkInterval;

	var checkInstances = function() {
		if ( checkingInstances ) {
			return;
		}
		checkingInstances = true;
		_.each(instances, function(instance, idx) {
			if ( !instance._inDocument() ) {
				instances.splice(idx, 1);
				instance.trigger('destroy');
				instance._destroy();
			}
		});
		checkingInstances = false;
	};
	checkInterval = setInterval(checkInstances, 1000);

	MicroEvent.mixin(Class.prototype);

	var Gizmo = Class.extend({
		'initialize': function(selector, options) {

			var self = this;

			self.options = options || {};
			self.defaults = self.defaults || {};

			_.defaults(self.options, self.defaults);

			if ( selector.indexOf('#') === 0 ) {
				selector = selector.substring(1);
			}
			self.container = document.getElementById(selector);
			if ( _.isNull(self.container) ) {
				throw 'Container does not exist: ' + selector;
			}

			var templateLoaded = self._loadTemplate();

			Deferred.when(templateLoaded).done(function(tpl) {
				self.init.call(self);
				whenLive(self.el, {
					'visibility': true
				}, function() {
					self.trigger('ready');
				});
			});

			instances.push(this);

		},

		'_destroyed': false,

		'_loadTemplate': function() {
			var self = this;
			if ( !_.isFunction(this.template) && !_.isString(this.template) && !_.isFunction(this.templateUrl) && !_.isString(this.templateUrl) ) {
				return false;
			}
			var d = new Deferred();
			var insertTemplate = function(tpl) {
				if ( _.isFunction(tpl) ) {
					tpl = tpl();
				}
				self.el = self._createElement(tpl);
				self.container.appendChild(self.el);
				d.resolve();
				return;
			};
			insertTemplate(this.template);
			return d.promise();
		},

		'_createElement': function(tpl) {
			var tmp = document.createElement('body');
			tmp.innerHTML = tpl;
			return tmp.firstChild;
		},

		'_destroy': function() {
			this._destroyed = true;
		},

		'_inDocument': function() {
			if ( document.documentElement.contains(this.el) ) {
				return true;
			}
			return false;
		},

		/**
		 * @override
		 */
		'init': function() {
		}
	});

	return Gizmo;

});
