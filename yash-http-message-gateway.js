'use strict';

var http = require('http');

function YashHttpMessageGateway(port, eventBus) {

    function getPort(port) {
        var _default_port = 8080;
        return port || _default_port
    }

    function writeWelcomeMessage(response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<html><body><h1>Tere-tere, kirjuta mulle midagi!</h1></body></html>');
        response.end();
    }

    function write406NotAcceptable(response) {
        response.writeHead(406);
        response.end();
    }

    function write403Forbidden(response) {
        response.writeHead(403);
        response.end();
    }

    function write400BadRequest(response) {
        response.writeHead(400);
        response.end();
    }

    function getPropertyValueCaseInsensitiveKey(theObject, key) {
        if (theObject) {
            var props = Object.keys(theObject);
            if (props && props.length) {
                for (var i = 0; i < props.length; i++) {
                    if (key.toLowerCase() == props[i].toLowerCase()) {
                        return theObject[props[i]];
                    }
                }
            }
        }
        return null;
    }

    function isJsonContentType(request) {
        return 'application/json' == getPropertyValueCaseInsensitiveKey(request.headers, 'content-type');
    }

    function isValidEvent(jsonRequestContents) {
        return jsonRequestContents['source'] && jsonRequestContents['body'];
    }

    function processMessagePostRequestJsonContents(jsonRequestContents, response) {
        if (!isValidEvent(jsonRequestContents)) {
            write400BadRequest(response)
        } else {
            console.log('Valid incoming message received: ');
            console.log(jsonRequestContents);
            if (eventBus) {
                eventBus.fireEvent({
                    source: jsonRequestContents.source,
                    time: new Date(),
                    body: jsonRequestContents.body
                });
            }
            response.writeHead(201);
            response.end();
        }
    }

    function processMessagePostRequestContents(requestContents, response) {
        if (requestContents) {
            try {
                var jsonRequestContents = JSON.parse(requestContents);
                processMessagePostRequestJsonContents(jsonRequestContents, response);
            } catch(e) {
                write400BadRequest(response);
            }
        } else {
            write400BadRequest(response);
        }
    }

    function processMessagePostRequest(request, response) {
        if (!isJsonContentType(request)) {
            write406NotAcceptable(response);
        } else {
            var requestContents = '';
            request.on('data', function (chunk) {
                requestContents += chunk;
            });
            request.on('end', function () {
                processMessagePostRequestContents(requestContents, response);
            });
        }
    }

    this._httpServer = http.createServer(function (request, response) {
        console.log('Incoming request method = %s ', request.method);
        console.log('Incoming request content type = %s ', request.headers['content-type']);
        if ('/message' == request.url) {
            if ('GET' == request.method) {
                writeWelcomeMessage(response);
            } else if ('POST' == request.method) {
                processMessagePostRequest(request, response);
            }
        } else {
            write403Forbidden(response);
        }
    });
    this._httpServer.listen(getPort(port));
}

YashHttpMessageGateway.prototype.stop = function() {
    if (this._httpServer && this._httpServer.listening) {
        this._httpServer.close();
    }
}

module.exports = YashHttpMessageGateway;