"use strict";

const YASH_DEFAULT_ZWAVE_DEVICE='/dev/ttyUSB0';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashZwaveGateway = require('./../yash-zwave-gateway.js');
var ZWave = require('openzwave-shared');
var zwave = new ZWave();

describe('YashZwaveGateway', function() {

    beforeEach(function() {
        sinon.stub(zwave, 'connect', function(usbId) {});
        sinon.stub(zwave, 'disconnect', function(usbId) {});
    });

    afterEach(function() {
        zwave.connect.restore();
        zwave.disconnect.restore();
    });

    it('should call zwave.connect with default USB device when started', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        yashZwaveGateway.start();
        zwave.connect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
        done();
    });

    it('should call zwave.disconnect with default USB device when stopped', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        yashZwaveGateway.stop();
        zwave.disconnect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
        done();
    });

    it('should have zero nodes after start is called', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        yashZwaveGateway.getNodes().should.have.lengthOf(0);
        done();
    });

    it('should not have nodes with ids 1, 2, 123, and 456 when addNode has never been called after start', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        should.not.exist(yashZwaveGateway.getNodes()[1]);
        should.not.exist(yashZwaveGateway.getNodes()[2]);
        should.not.exist(yashZwaveGateway.getNodes()[123]);
        should.not.exist(yashZwaveGateway.getNodes()[456]);
        done();
    });

    it('should have the node with given ID after addNode is called', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        yashZwaveGateway.addNode(1);
        should.exist(yashZwaveGateway.getNodes()[1]);
        yashZwaveGateway.getNodes()[1].should.be.an('object');
        done();
    });

    it('should have three nodes with given IDs after addNode is called three times', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        should.not.exist(yashZwaveGateway.getNodes()[4]);
        should.not.exist(yashZwaveGateway.getNodes()[13]);
        should.not.exist(yashZwaveGateway.getNodes()[257]);
        yashZwaveGateway.addNode(4);
        yashZwaveGateway.addNode(13);
        yashZwaveGateway.addNode(257);
        yashZwaveGateway.getNodes()[4].should.be.an('object');
        yashZwaveGateway.getNodes()[13].should.be.an('object');
        yashZwaveGateway.getNodes()[257].should.be.an('object');
        should.not.exist(yashZwaveGateway.getNodes()[1]);
        should.not.exist(yashZwaveGateway.getNodes()[2]);
        should.not.exist(yashZwaveGateway.getNodes()[3]);
        should.not.exist(yashZwaveGateway.getNodes()[5]);
        should.not.exist(yashZwaveGateway.getNodes()[11]);
        should.not.exist(yashZwaveGateway.getNodes()[258]);
        done();
    });

});