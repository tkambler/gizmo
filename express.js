var express = require('express'),
    server = express(),
    port = 3000;
server.configure(function(){
	server.use('/', express.static(__dirname + '/example'));
	server.use('/gizmo', express.static(__dirname + '/dist'));
	server.use('/src', express.static(__dirname + '/src'));
});
server.listen(port);
console.log('Express server is now listening on port:', port);
