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

        it('should truncate message at Twitters message length limit when message is sent', function(done) {
            const MAX_LENGTH = 140;
            const TEST_MESSAGE = 'test content and some more test content ant then a few more and finally just a little more and finally taruiraraa nadinunnadinaa ja hopsa-hopsa-hopsassaa ja siis veel mingi pikk jutt sitt jutt.'
            var expectedMessage = ('testSender: '+TEST_MESSAGE).substr(0, MAX_LENGTH-3).concat('...');
            var messenger = new YashTwitterMessenger(twitter);
            messenger.sendMessage(
                'testSender',
                TEST_MESSAGE
            );
            twitter.post.should.have.been.calledWith('statuses/update', {status: expectedMessage});
            done();
        });

    });

});



