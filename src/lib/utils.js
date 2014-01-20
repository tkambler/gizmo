define([
	'./lodash.underscore'
], function(_) {

	return {
		'isNonEmptyFunction': function(fn) {
			var txt,
				txtTmp;
			if ( !_.isFunction(fn) ) {
				return false;
			}
			txt = fn.toString();
			txtTmp = txt.split('{', 2);
			if ( !txtTmp[1] ) {
				return false;
			}
			txtTmp[1] = txtTmp[1].replace(/^\s+|\s+$/g,'');
			if ( txtTmp[1] !== '}' ) {
				return true;
			}
			return false;
		}
	};

});
