'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashAlerter = require('./../yash-alerter.js');

describe('YashAlerter', function() {

    function createMockMessenger() {
        var messenger = new Object();
        messenger.sendMessage = function(){};
        return messenger;
    }

    var yashAlerter;
    var messenger = createMockMessenger();

    beforeEach(function() {
        sinon.spy(messenger, 'sendMessage');
        yashAlerter = new YashAlerter(messenger);
    });

    afterEach(function() {
        messenger.sendMessage.restore();
    });

    it('should send a message via messenger when any event fires', function(done) {
        yashAlerter.onEvent({
            source: 'Some test source',
            time: new Date(),
            body: 'Something fishy is going on'
        });
        messenger.sendMessage.should.have.been.calledWith('Some test source', 'Something fishy is going on');
        done();
    });

    it('should not send a message from ignored device', function(done) {
        yashAlerter.addIgnoredEventSource('An ignored test device');
        yashAlerter.onEvent({
            source: 'An ignored test device',
            time: new Date(),
            body: 'Something fishy is going on'
        });
        messenger.sendMessage.should.not.have.been.calledWith('An ignored test device', 'Something fishy is going on');
        done();
    });

});