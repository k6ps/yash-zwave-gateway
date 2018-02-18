'use strict';

var http = require('http');

function YashHttpMessageGateway(port) {
    var _default_port = 8080;
    http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<html><body><h1>Taruiraraa ja hopsasssaa!</h1></body></html>');
        response.end();
    }).listen(port || _default_port);
}

module.exports = YashHttpMessageGateway;