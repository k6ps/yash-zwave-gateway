'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashHttpMessageGateway = require('./../yash-http-message-gateway.js');
var http = require('http');

describe('YashHttpMessageGateway', function() {

    var yashHttpMessageGateway;

    afterEach(function() {
        if (yashHttpMessageGateway) {
            yashHttpMessageGateway.stop();
        }
    });

    describe('server', function() {

        it('should start a http server when created', function(done) {
            sinon.spy(http, 'createServer');
            yashHttpMessageGateway = new YashHttpMessageGateway();
            http.createServer.should.have.been.called;
            http.createServer.restore();
            done();
        });

        it('should listen in a given port', function(done) {
            var testPort = 4334;
            var httpServer = new Object();
            httpServer.listen = function(port) {
                //do nothing
            };
            sinon.spy(httpServer, 'listen');
            sinon.stub(http, 'createServer', function() {
                return httpServer;
            });
            yashHttpMessageGateway = new YashHttpMessageGateway(testPort);
            httpServer.listen.should.have.been.calledWith(testPort);
            http.createServer.restore();
            done();
        });

        it('should listen in default port when no port given', function(done) {
            var default_port = 8080;
            var httpServer = new Object();
            httpServer.listen = function(port) {
                //do nothing
            };
            sinon.spy(httpServer, 'listen');
            sinon.stub(http, 'createServer', function() {
                return httpServer;
            });
            yashHttpMessageGateway = new YashHttpMessageGateway();
            httpServer.listen.should.have.been.calledWith(default_port);
            http.createServer.restore();
            done();
        });

    });

    describe('/', function() {

        beforeEach(function() {
            yashHttpMessageGateway = new YashHttpMessageGateway();
        });

        it('should return 403 forbidden on HTTP GET', function(done) {
            http.get('http://localhost:8080', function (response) {
                response.statusCode.should.equal(403);
                done();
            });
        });

        it('should return 403 forbidden on HTTP POST', function(done) {
            var postRequestData = {
                host: 'localhost',
                port: '8080',
                method: 'POST'
            };
            var postRequest = http.request(postRequestData, function (response) {
                response.statusCode.should.equal(403);
                done();
            });
            postRequest.end();
        });

    });

    describe('/message', function() {

        describe('GET', function() {

            it('should return welcome message', function(done) {
                yashHttpMessageGateway = new YashHttpMessageGateway();
                http.get('http://localhost:8080/message', function (response) {
                    response.statusCode.should.equal(200);
                    var data = '';

                    response.on('data', function (chunk) {
                        data += chunk;
                    });

                    response.on('end', function () {
                        data.should.contain('Tere-tere, kirjuta mulle midagi!');
                        done();
                    });
                });
            });

        });

        describe('POST', function() {

            function createMockEventBus() {
                var eventBus = new Object();
                eventBus.fireEvent = function(ignoredArg) {
                    console.log("Event fired on event bus!");
                };
                return eventBus;
            }

            var eventBus = createMockEventBus();
            var postRequestData;

            beforeEach(function() {
                sinon.spy(eventBus, 'fireEvent');
                postRequestData = {
                    host: 'localhost',
                    path: '/message',
                    port: '8080',
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                };
                yashHttpMessageGateway = new YashHttpMessageGateway(8080, eventBus);
            });

            afterEach(function() {
                eventBus.fireEvent.restore();
            });

            it('should return 201 on correct message', function(done){
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    body: 'test event'
                });
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(201);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should put correct message on message bus', function(done){
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    body: 'test event'
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function(response) {
                    eventBus.fireEvent.should.have.been.called;
                    eventBus.fireEvent.lastCall.args[0].source.should.equal('test sensor');
                    eventBus.fireEvent.lastCall.args[0].body.should.equal('test event');
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should should support complex object as message body on message bus', function(done){
                var bodyObject = {
                    'eee': 'uuu',
                    'aaa': {
                        'bb': 1,
                        'cc': 2
                    },
                    'ooo': 42.12122,
                    'iii': [11, 22, 33, 44]
                };
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    body: bodyObject
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function(response) {
                    eventBus.fireEvent.should.have.been.called;
                    eventBus.fireEvent.lastCall.args[0].body['eee'].should.equal('uuu');
                    eventBus.fireEvent.lastCall.args[0].body['ooo'].should.equal(42.12122);
                    eventBus.fireEvent.lastCall.args[0].body['aaa']['cc'].should.equal(2);
                    eventBus.fireEvent.lastCall.args[0].body['iii'][2].should.equal(33);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should add correct time when putting message on message bus', function(done){

                function getOneMinuteAgo() {
                    var t = new Date();
                    t.setMinutes(t.getMinutes() - 1);
                    return t;
                }

                function getOneMinuteLater() {
                    var t = new Date();
                    t.setMinutes(t.getMinutes() + 1);
                    return t;
                }

                var oneMinuteAgo = getOneMinuteAgo();
                var oneMinuteLater = getOneMinuteLater();
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    body: 'test event'
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function(response) {
                    eventBus.fireEvent.should.have.been.called;
                    eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo, oneMinuteLater);;
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 400 when message has no body parameter', function(done){
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    time: new Date()
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(400);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 400 when message has empty body parameter', function(done){
                var postContents = JSON.stringify({
                    source: 'test sensor',
                    time: new Date(),
                    body: ''
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(400);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 400 when message has empty source parameter', function(done){
                var postContents = JSON.stringify({
                    source: '',
                    time: new Date(),
                    body: 'test event'
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(400);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 400 when message has no source parameter', function(done){
                var postContents = JSON.stringify({
                    time: new Date(),
                    body: 'test event'
                })
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(400);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 406 when the request is not JSON', function(done){
                var postContents = "taruiraraa ja hopsassaaa"
                postRequestData.headers['Content-Type'] = 'application/text';
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(406);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

            it('should return 400 when the request is not well-formed JSON', function(done){
                var postContents = "{ 'taruiraraa' ja hopsassaaa }"
                postRequestData.headers['Content-Length'] = Buffer.byteLength(postContents);
                var postRequest = http.request(postRequestData, function (response) {
                    response.statusCode.should.equal(400);
                    done();
                });
                postRequest.write(postContents);
                postRequest.end();
            });

        });

    });

});