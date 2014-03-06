define([], function() {

	/**
	 * @class AttachmentWatcher
	 */
	var AttachmentWatcher = function() {
		this.init.apply(this, _.toArray(arguments));
	};

	_.extend(AttachmentWatcher.prototype, {

		'init': function() {
		}

	});

	return new AttachmentWatcher();

});
