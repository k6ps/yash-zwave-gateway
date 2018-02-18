'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashHttpMessageGateway = require('./../yash-http-message-gateway.js');
var http = require('http');

describe('YashHttpMessageGateway', function() {

    afterEach(function() {
        http.createServer.restore();
    });

    it('should start a http server when created', function(done) {
        sinon.spy(http, 'createServer');
        var yashHttpMessageGateway = new YashHttpMessageGateway();
        http.createServer.should.have.been.called;
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
        var yashHttpMessageGateway = new YashHttpMessageGateway(testPort);
        httpServer.listen.should.have.been.calledWith(testPort);
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
        var yashHttpMessageGateway = new YashHttpMessageGateway();
        httpServer.listen.should.have.been.calledWith(default_port);
        done();
    });

});