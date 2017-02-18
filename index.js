'use strict';

var ZWave = require('openzwave-shared');
var zwave = new ZWave();
var YashZwaveGateway = require('./yash-zwave-gateway.js');
var yashZwaveGateway = new YashZwaveGateway(zwave, yashTwitterMessenger);
var Twitter = require('twitter');
var twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var YashTwitterMessenger = require('./yash-twitter-messenger.js');
var yashTwitterMessenger = new YashTwitterMessenger(twitter);

yashZwaveGateway.start();

process.on('SIGINT', function() {
    yashZwaveGateway.stop();
    console.log("Z-Wave Gateway stopped.");
    process.exit();
});