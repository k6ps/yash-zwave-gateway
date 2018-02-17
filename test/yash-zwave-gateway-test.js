'use strict';

const YASH_DEFAULT_ZWAVE_DEVICE = '/dev/ttyUSB0';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashZwaveGateway = require('./../yash-zwave-gateway.js');
var ZWave = require('openzwave-shared');
var zwave = new ZWave();

describe('YashZwaveGateway', function() {

    function createMockEventBus() {
        var eventBus = new Object();
        eventBus.fireEvent = function(ignoredArg1, ignoredArg2, ignoredArg3) {};
        return eventBus;
    }

    var eventBus = createMockEventBus();
    var zwaveEventCallbacks = {};
    var yashZwaveGateway;
    var oneMinuteLater;
    var oneMinuteAgo;

    function registerEventCallback(event, callback) {
        console.log('Registering callback for event: '+event);
        zwaveEventCallbacks[event] = callback;
    }

    function clearEventCallbacks() {
        zwaveEventCallbacks = {};
    }

    function fireEvent(eventName, eventArg1, eventArg2, eventArg3) {
        if (zwaveEventCallbacks[eventName]) {
            console.log('Firing event: '+eventName);
            zwaveEventCallbacks[eventName](eventArg1, eventArg2, eventArg3);
        }
    }

    function stubZWave() {
        sinon.stub(zwave, 'connect', function(usbId) {});
        sinon.stub(zwave, 'disconnect', function(usbId) {});
        sinon.stub(zwave, 'on', function(eventName, eventCallback) {
            registerEventCallback(eventName, eventCallback);
        });
    }

    function stubEventBus() {
        sinon.stub(eventBus, 'fireEvent', function(event) {});
    }

    function restoreZWave() {
        zwave.connect.restore();
        zwave.disconnect.restore();
        zwave.on.restore();
    }

    function restoreEventBus() {
        eventBus.fireEvent.restore();
    }

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

    beforeEach(function() {
        stubZWave();
        stubEventBus();
        yashZwaveGateway = new YashZwaveGateway(zwave, eventBus);
        oneMinuteAgo = getOneMinuteAgo();
        oneMinuteLater = getOneMinuteLater();
    });

    afterEach(function() {
        restoreZWave();
        clearEventCallbacks();
        restoreEventBus();
    });

    describe('#start()', function() {

        beforeEach(function() {
            yashZwaveGateway.start();
        });

        it('should call zwave.connect with default USB device when started', function(done) {
            zwave.connect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
            done();
        });

        it('should send startup message when started', function(done) {
            eventBus.fireEvent.should.have.been.called;
            eventBus.fireEvent.lastCall.args[0].source.should.equal('Z-Wave Network');
            eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
            eventBus.fireEvent.lastCall.args[0].body.should.equal('Starting up...');
            done();
        });

        it('should send success message when started successfully', function(done) {
            fireEvent('scan complete');
            eventBus.fireEvent.should.have.been.called;
            eventBus.fireEvent.lastCall.args[0].source.should.equal('Z-Wave Network');
            eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
            eventBus.fireEvent.lastCall.args[0].body.should.equal('Startup successful, initial network scan complete.');
            done();
        });

        it('should send failure message when driver fails', function(done) {
            fireEvent('driver failed');
            eventBus.fireEvent.should.have.been.called;
            eventBus.fireEvent.lastCall.args[0].source.should.equal('Z-Wave Network');
            eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
            eventBus.fireEvent.lastCall.args[0].body.should.equal('Driver failed, network not started.');
            done();
        });

    });    

    describe('#stop()', function() {

        beforeEach(function() {
            yashZwaveGateway.stop();
        });

        it('should call zwave.disconnect with default USB device when stopped', function(done) {
            zwave.disconnect.should.have.been.calledWith(YASH_DEFAULT_ZWAVE_DEVICE);
            done();
        });

        it('should send stopped message when stopped', function(done) {
            eventBus.fireEvent.should.have.been.called;
            eventBus.fireEvent.lastCall.args[0].source.should.equal('Z-Wave Network');
            eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
            eventBus.fireEvent.lastCall.args[0].body.should.equal('Stopped.');
            done();
        });

    });

    describe('#getNodes()', function() {

        it('should have zero nodes after start is called', function(done) {
            yashZwaveGateway.getNodes().should.have.lengthOf(0);
            done();
        });

        it('should not have nodes with ids 1, 2, 123, and 456 when addNode has never been called after start', function(done) {
            var nodes = yashZwaveGateway.getNodes();
            should.not.exist(nodes[1]);
            should.not.exist(nodes[2]);
            should.not.exist(nodes[123]);
            should.not.exist(nodes[456]);
            done();
        });

    });

    describe('node events', function() {

        const TEST_NODE_ID = 4;
        var testNode;

        beforeEach(function() {
            yashZwaveGateway.start();
            fireEvent('node added', TEST_NODE_ID);
            testNode = yashZwaveGateway.getNodes()[TEST_NODE_ID];
        });

        describe('node added', function() {

            it('should have the node with given ID and all empty details when zwave fires node added event', function(done) {
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

            it('should have three nodes with given IDs after zwave fires node added event three times', function(done) {
                should.not.exist(yashZwaveGateway.getNodes()[13]);
                should.not.exist(yashZwaveGateway.getNodes()[257]);
                fireEvent('node added', 13);
                fireEvent('node added', 257);
                testNode.should.be.an('object');
                yashZwaveGateway.getNodes()[13].should.be.an('object');
                yashZwaveGateway.getNodes()[257].should.be.an('object');
                should.not.exist(yashZwaveGateway.getNodes()[0]);
                should.not.exist(yashZwaveGateway.getNodes()[2]);
                should.not.exist(yashZwaveGateway.getNodes()[3]);
                should.not.exist(yashZwaveGateway.getNodes()[5]);
                should.not.exist(yashZwaveGateway.getNodes()[11]);
                should.not.exist(yashZwaveGateway.getNodes()[258]);
                done();
            });

        });
        
        describe('node ready', function() {

            it('should mark node as ready when zwave fires node ready event', function(done) {
                testNode.ready.should.equal(false);
                fireEvent('node ready', TEST_NODE_ID, {});
                testNode.ready.should.equal(true);
                done();
            });

            it('should set node details when zwave fires node ready event', function(done) {
                fireEvent('node ready', TEST_NODE_ID, {
                    manufacturer: 'test manufacturer',
                    manufacturerid: 123,
                    product: 'Test Product',
                    producttype: 'Test ProductType',
                    productid: 321,
                    type: 'test type',
                    name: 'Test Product 123',
                    loc: 112233
                });
                should.exist(testNode);
                testNode.should.be.an('object');
                testNode.manufacturer.should.equal('test manufacturer');
                testNode.manufacturerid.should.equal(123);
                testNode.product.should.equal('Test Product');
                testNode.producttype.should.equal('Test ProductType');
                testNode.productid.should.equal(321);
                testNode.type.should.equal('test type');
                testNode.name.should.equal('Test Product 123');
                testNode.loc.should.equal(112233);
                done();
            });

        });

        describe('value added', function() {

            it('should add node value when zwave fires value added event', function(done) {
                testNode.classes.should.be.empty;
                fireEvent('value added', TEST_NODE_ID, 0x12, {
                    index: 'testIndex',
                    label: 'testLabel',
                    value: 'testValue'
                });
                testNode.classes.should.be.an('object');
                testNode.classes[0x12].should.be.an('object');
                testNode.classes[0x12]['testIndex'].should.be.an('object');
                testNode.classes[0x12]['testIndex']['label'].should.equal('testLabel');
                testNode.classes[0x12]['testIndex']['value'].should.equal('testValue');
                done();
            });

        });

        describe('value changed', function() {

            function fireValueAdded(nodeid, value) {
                fireEvent('value added', nodeid, 0x12, {
                    index: 'testIndex',
                    label: 'testLabel',
                    value: value
                });
            }

            function fireValueChanged(nodeid, value) {
                fireEvent('value changed', nodeid, 0x12, {
                    index: 'testIndex',
                    label: 'testLabel',
                    value: value
                });
            }

            it('should change node value when zwave fires value changed event', function(done) {
                testNode.classes.should.be.empty;
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'newValue');
                testNode.classes.should.be.an('object');
                testNode.classes[0x12].should.be.an('object');
                testNode.classes[0x12]['testIndex'].should.be.an('object');
                testNode.classes[0x12]['testIndex']['label'].should.equal('testLabel');
                testNode.classes[0x12]['testIndex']['value'].should.equal('newValue');
                done();
            });

            it('should send message when node is ready and zwave fires value changed event', function(done) {
                fireEvent('node ready', TEST_NODE_ID, {});
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'newValue');
                eventBus.fireEvent.should.have.been.called;
                eventBus.fireEvent.lastCall.args[0].source.should.equal('Node '+TEST_NODE_ID);
                eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
                eventBus.fireEvent.lastCall.args[0].body.should.equal('Value testLabel changed from testValue to newValue.');
                done();
            });

            it('should use node name in message when zwave fires value changed event', function(done) {
                const TEST_NODE_NAME = 'Test Product 123';
                fireEvent('node ready', TEST_NODE_ID, {
                    name: TEST_NODE_NAME
                });
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'newValue');
                eventBus.fireEvent.should.have.been.called;
                eventBus.fireEvent.lastCall.args[0].source.should.equal(TEST_NODE_NAME);
                eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
                eventBus.fireEvent.lastCall.args[0].body.should.equal('Value testLabel changed from testValue to newValue.');
                done();
            });

            it('should use node manufacturer and product in message when zwave fires value changed event and name is not given', function(done) {
                const TEST_NODE_MANUFACTURER = 'TestCo. Ltd.';
                const TEST_NODE_PRODUCT = 'HyperCoolTestProduct 2'
                fireEvent('node ready', TEST_NODE_ID, {
                    manufacturer: TEST_NODE_MANUFACTURER,
                    product: TEST_NODE_PRODUCT
                });
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'newValue');
                eventBus.fireEvent.should.have.been.called;
                eventBus.fireEvent.lastCall.args[0].source.should.equal(TEST_NODE_MANUFACTURER+' '+TEST_NODE_PRODUCT);
                eventBus.fireEvent.lastCall.args[0].time.should.be.within(oneMinuteAgo,oneMinuteLater);
                eventBus.fireEvent.lastCall.args[0].body.should.equal('Value testLabel changed from testValue to newValue.');
                done();
            });

            it('should not send message when node is not ready and zwave fires value changed event', function(done) {
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'newValue');
                eventBus.fireEvent.should.not.have.been.calledWith(
                    sinon.match({
                        source: 'Node '+TEST_NODE_ID,
                        body: 'Value testLabel changed from testValue to newValue.'
                    })
                );
                done();
            });

            it('should not send message when node is ready and zwave fires value changed event and new value equals old value', function(done) {
                fireEvent('node ready', TEST_NODE_ID, {});
                fireValueAdded(TEST_NODE_ID, 'testValue');
                fireValueChanged(TEST_NODE_ID, 'testValue');
                eventBus.fireEvent.should.not.have.been.calledWith(
                    sinon.match({
                        source: 'Node '+TEST_NODE_ID,
                        body: 'Value testLabel changed from testValue to testValue.'
                    })
                );
                done();
            });

        });

    });

});