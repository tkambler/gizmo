define([
	'gizmo',
	'text!./lib/template.tpl',
	'css!./lib/style.css'
], function(Gizmo, template, css) {

	var Widget = Gizmo.extend({
		'template': function() {
			return template;
		},
		'init': function() {

			console.log('Widget has initialized.');

			this.bind('ready', function() {
				console.log('I am ready.');
			});

			this.bind('destroy', function() {
				console.log('I have been destroyed.');
			});

		},
		'doSomething': function() {
			console.log('I am doing something.');
		}
	});

	return Widget;

});
