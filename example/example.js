require(['./widget/widget', './widget2/widget'], function(Widget, Widget2) {

	var widget = new Widget('container', {
		'first_name': 'Tim'
	});

	/*
	setTimeout(function() {
		// var child = document.getElementById('container');
		// child.innerHTML = 'container';
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		console.log('...');
	}, 2000);
	*/

});
