define('gizmo', function(require) {

	var Deferred = require('./lib/deferred'),
		MicroEvent = require('./lib/microevent'),
		_ = require('./lib/lodash.underscore'),
		whenLive = require('./lib/whenlive'),
		utils = require('./lib/utils'),
		transfuse = require('./lib/transfuse'),
		Class = require('./lib/extend');

	var instances = [],
		checkingInstances = false,
		checkInterval;

	var checkInstances = function() {
		if ( checkingInstances ) {
			return;
		}
		checkingInstances = true;
		instances = _.map(instances, function(instance) {
			if ( !instance._inDocument() ) {
				instance.trigger('destroy');
				instance._destroy();
				return null;
			} else {
				return instance;
			}
		});
		instances = _.compact(instances);
		checkingInstances = false;
	};
	checkInterval = setInterval(checkInstances, 1000);

	MicroEvent.mixin(Class.prototype);

	var Gizmo = Class.extend({
		'initialize': function(selector, options, el) {

			var self = this;

			self.options = options || {};
			self.defaults = self.defaults || {};

			_.defaults(self.options, self.defaults);

			if (this.attach && el) {
				self.container = el;
				self.init.call(self);
				self._loadTemplate();
				whenLive(el, {
					'visibility': true
				}, function() {
					self.trigger('ready');
				});
				instances.push(this);
			} else if (selector) {
				if ( selector.indexOf('#') === 0 ) {
					selector = selector.substring(1);
				}
				self.container = document.getElementById(selector);
				if ( _.isNull(self.container) ) {
					throw 'Container does not exist: ' + selector;
				}
				self.init.call(self);
				self._loadTemplate();
				whenLive(self.el, {
					'visibility': true
				}, function() {
					self.trigger('ready');
				});
				instances.push(this);
			} else {
				throw 'A Gizmo class requires a value for either `selector` or `attach`.';
			}

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
					tpl = tpl.call(self);
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

	Gizmo.onNewAttachment = function(selector, Class) {
		whenLive(selector, {
			'visibility': false
		}, function(el) {
			var instance = new Class(null, null, el);
		});
	};

	transfuse.set('gizmo', Gizmo);

	return Gizmo;

});
