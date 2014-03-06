(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.returnExports = factory();
  }
}(this, function () {

/**
 * Contains any additional sandboxes that may be created using the
 * transfuse.createContext() method.
 */
var contexts = {};

/**
 * Transfuse is a lightweight JavaScript dependency injection container.
 *
 * @see {@link https://github.com/tkambler/transfuse.js|https://github.com/tkambler/transfuse.js}
 * @class Transfuse
 * @constructor
 */
var Transfuse = function() {

	var self = this;

	/**
	 * Sandbox object containing any defined dependencies.
	 *
	 * @property
	 */
	this.dependencies = {};

	/**
	 * Private method for accurately type checking objects.
	 *
	 * @method _type
	 * @private
	 */
	this._type = function(o) {
		return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
	}

	/**
	 * Stores a dependency which can be referenced later using the specified name.
	 *
	 * @method set
	 * @param {String} name - A name that identifies the dependency you are setting.
	 * @param {Mixed} value - The dependency you are setting. Can be anything.
	 */
	this.set = function(name, value) {
		if ( this._type(name) === 'Object' ) {
			for ( var key in name ) {
				self.set(key, name[key]);
			}
			return;
		}
		if ( typeof this.dependencies[name] !== 'undefined' ) {
			throw 'Dependency `' + name + '` is already defined.';
		}
		this.dependencies[name] = value;
	};

	this.unset = function(name) {
		if (this.dependencies[name]) {
			delete this.dependencies[name];
		}
	};

	/**
	 * Retrieves a specific dependency by name.
	 *
	 * @method get
	 * @param {String} name - The name of the dependency to be retrieved.
	 * @return {Mixed} Returns the dependency or undefined if it does not exist.
	 */
	this.get = function(name) {
		if ( this._type(name) === 'String' ) {
			return this.dependencies[name];
		} else if ( this._type(name) === 'Array' ) {
			var result = {};
			for ( var key in name ) {
				result[name[key]] = this.dependencies[key];
			}
			return result;
		}
	};

	/**
	 * Given an object and an array of dependency names, this method will extend the
	 * object with the specified dependencies. Chainable. For example:
	 *
	 * var obj = {};
	 * transfuse.extend(obj, ['dep1', 'dep2']);
	 * console.log(obj.dep1);
	 * console.log(obj.dep2);
	 *
	 * @method extend
	 * @param {Object} obj - The object to be extended.
	 * @param {Array} - An array of dependency names to be mixed in.
	 */
	this.extend = function(obj, dependencies) {
		for ( var key in dependencies ) {
			obj[dependencies[key]] = this.dependencies[dependencies[key]];
		}
		return obj;
	};

	/**
	 * The get(), set(), and extend() methods all have a single shared sandbox from
	 * which they manage dependencies. If you need greater segmentation, you can
	 * call this method to create additional sandboxes ("contexts").
	 *
	 * @method createContext
	 * @param {String} name - The name that identifies the newly created sandbox.
	 */
	this.createContext = function(name) {
		if ( typeof contexts[name] !== 'undefined' ) {
			throw 'Context `' + name + '` is already defined.';
		}
		contexts[name] = new Transfuse();
		return contexts[name];
	};

	/**
	 * Retrieves a sandbox by name.
	 *
	 * @method getContext
	 * @param {String} name - The name of the sandbox to be retrieved.
	 */
	this.getContext = function(name) {
		if ( typeof contexts[name] === 'undefined' ) {
			throw 'Context `' + name + '` does not exist.';
		}
		return contexts[name];
	};

};

return new Transfuse();

}));
