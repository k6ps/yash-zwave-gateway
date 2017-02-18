'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var should = chai.should();

var Twitter = require('twitter');
var twitter = new Twitter({
  consumer_key: 'Aaa',
  consumer_secret: 'Bbb',
  access_token_key: 'Ccc',
  access_token_secret: 'Ddd'
});
var YashTwitterMessenger = require('./../yash-twitter-messenger.js');

describe('YashTwitterMessenger', function() {

    beforeEach(function() {
        sinon.stub(twitter, 'post', function(path, statusObject, callbackFunction) {});
    });

    afterEach(function() {
        twitter.post.restore();
    });

    describe('#sendMessage()', function() {

        it('should call twitter.post with status update containing message data when message is sent', function(done) {
            var messenger = new YashTwitterMessenger(twitter);
            messenger.sendMessage('testSender','test content');
            twitter.post.should.have.been.calledWith('statuses/update', {status: 'testSender: test content'});
            done();
        });

    });

});



