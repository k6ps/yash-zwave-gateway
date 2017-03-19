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

    beforeEach(function() {
        sinon.spy(messenger, 'sendMessage');
    });

    afterEach(function() {
        messenger.sendMessage.restore();
    });

    it('should send a message via twitter alerter when any event fires', function(done) {
        var yashAlerter = new YashAlerter(messenger);
        yashAlerter.onEvent({
            source: 'Some test source',
            time: new Date(),
            body: 'Something fishy is going on'
        });
        messenger.sendMessage.should.have.been.calledWith('Some test source', 'Something fishy is going on');
        done();
    });

});