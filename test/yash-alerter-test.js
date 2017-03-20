'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var YashTwitterMessenger = require('./../yash-twitter-messenger.js');
var messenger = new YashTwitterMessenger();

var YashAlerter = require('./../yash-alerter.js');

describe('YashAlerter', function() {

    var yashAlerter;

    beforeEach(function() {
        sinon.spy(messenger, 'sendMessage');
        yashAlerter = new YashAlerter(messenger);
    });

    afterEach(function() {
        messenger.sendMessage.restore();
    });

    it('should send a message via twitter alerter when any event fires', function(done) {
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