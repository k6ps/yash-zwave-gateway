"use strict";

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

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
        zwave.connect.should.have.been.calledWith('/dev/ttyUSB0');
        done();
    });

    it('should call zwave.disconnect with default USB device when stopped', function(done) {
        var yashZwaveGateway = new YashZwaveGateway(zwave);
        yashZwaveGateway.stop();
        zwave.disconnect.should.have.been.calledWith('/dev/ttyUSB0');
        done();
    });

});