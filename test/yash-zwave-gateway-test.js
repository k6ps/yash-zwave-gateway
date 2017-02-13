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

    describe('#start()', function() {

        it('should call zwave.connect with default USB device when started', function(done) {
            var yashZwaveGateway = new YashZwaveGateway(zwave);
            yashZwaveGateway.start(function() {}, function() {});
            zwave.connect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
            done();
        });

        it('should call the success callback function when started successfully', function(done) {
            var yashZwaveGateway = new YashZwaveGateway(zwave);
            yashZwaveGateway.start(function() {
                done();
            }, function() {
                done("Error: failure callback should not have been called in this case.");
            });
        });

    });    

    describe('#stop()', function() {

        it('should call zwave.disconnect with default USB device when stopped', function(done) {
            var yashZwaveGateway = new YashZwaveGateway(zwave);
            yashZwaveGateway.stop();
            zwave.disconnect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
            done();
        });

    });


    describe('#getNodes()', function() {

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

    });

    describe('#addNode()', function() {

        it('should have the node with given ID and all empty values when addNode is called', function(done) {
            var yashZwaveGateway = new YashZwaveGateway(zwave);
            yashZwaveGateway.addNode(1);
            var testNode = yashZwaveGateway.getNodes()[1];
            should.exist(testNode);
            testNode.should.be.an('object');
            testNode.manufacturer.should.equal('');
            testNode.manufacturerid.should.equal('');
            testNode.product.should.equal('');
            testNode.producttype.should.equal('');
            testNode.productid.should.equal('');
            testNode.type.should.equal('');
            testNode.name.should.equal('');
            testNode.loc.should.equal('');
            testNode.classes.should.be.empty;
            testNode.ready.should.equal(false);
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

});