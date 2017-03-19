'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashSimpleEventBus = require('./../yash-simple-event-bus.js');

describe('YashSimpleEventBus', function() {

    describe('#addEventListener()', function() {

        it('Should have no event listeners by default', function(done) {
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.getEventListeners().should.have.lengthOf(0);
            done();
        });

        it('Should have the event listener that was added', function(done) {
            var testEventListener = {
                name: 'someCoolTestEventListener'
            };
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.getEventListeners().should.have.lengthOf(1);
            yashSimpleEventBus.getEventListeners()[0].should.be.an('object');
            yashSimpleEventBus.getEventListeners()[0].name.should.equal('someCoolTestEventListener');
            done();
        });

        it('Should have multiple event listener that were added', function(done) {
            var testEventListener = {
                name: 'someCoolTestEventListener'
            };
            var testEventListener2 = {
                name: 'anotherTestEventListener'
            };
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.addEventListener(testEventListener2);
            yashSimpleEventBus.getEventListeners().should.have.lengthOf(2);
            yashSimpleEventBus.getEventListeners()[0].should.be.an('object');
            yashSimpleEventBus.getEventListeners()[0].name.should.equal('someCoolTestEventListener');
            yashSimpleEventBus.getEventListeners()[1].should.be.an('object');
            yashSimpleEventBus.getEventListeners()[1].name.should.equal('anotherTestEventListener');
            done();
        });

    });

    describe('#fireEvent', function() {

        it('should not fail when there are no event listeners and  event is fired', function(done) {
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.fireEvent({});
            done();       
        });

        it('should call single event listener when event is fired', function(done) {
            var testEventListener = {
                name: 'testEventListener',
                onEvent: function() {}
            };
            sinon.spy(testEventListener, 'onEvent');
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.fireEvent({});
            testEventListener.onEvent.should.have.been.called;
            done();       
        });

        it('should include the correct event data with call to event listener when event is fired', function(done) {
            var testEventListener = {
                name: 'testEventListener',
                onEvent: function() {}
            };
            var testEventTime = new Date(2012,2,28,13,23,58,122);
            sinon.spy(testEventListener, 'onEvent');
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.fireEvent({
                source: 'some source', 
                time: testEventTime,
                stuff: 'Blahh'
            });
            testEventListener.onEvent.getCall(0).args[0].source.should.equal('some source');
            testEventListener.onEvent.getCall(0).args[0].time.should.equal(testEventTime);
            testEventListener.onEvent.getCall(0).args[0].stuff.should.equal('Blahh');
            done();       
        });

        it('should call multiple event listeners when event is fired', function(done) {
            var testEventListener = {
                name: 'testEventListener',
                onEvent: function() {}
            };
            var testEventListener2 = {
                name: 'testEventListener2',
                onEvent: function() {}
            };
            sinon.spy(testEventListener, 'onEvent');
            sinon.spy(testEventListener2, 'onEvent');
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.addEventListener(testEventListener2);
            yashSimpleEventBus.fireEvent({});
            testEventListener.onEvent.should.have.been.called;
            testEventListener2.onEvent.should.have.been.called;
            done();       
        });

        it('should not fail when event listener does not have onEvent method and event is fired', function(done) {
            var testEventListener = {
                name: 'testEventListener'
            };
            var yashSimpleEventBus = new YashSimpleEventBus();
            yashSimpleEventBus.addEventListener(testEventListener);
            yashSimpleEventBus.fireEvent({});
            done();       
        });

    });

});
