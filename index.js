'use strict';

var Twitter = require('twitter');
console.log('Twitter consumer key = '+process.env.TWITTER_CONSUMER_KEY);
var twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var YashTwitterMessenger = require('./yash-twitter-messenger.js');
var yashTwitterMessenger = new YashTwitterMessenger(twitter);

var YashAlerter = require('./yash-alerter.js');
var yashAlerter = new YashAlerter(yashTwitterMessenger);
yashAlerter.addIgnoredEventSource('FIBARO System FGWPE Wall Plug');

var ZWave = require('openzwave-shared');
var zwave = new ZWave({
    Logging: false,
    ConsoleOutput: true
});

var YashSimpleEventBus = require('./yash-simple-event-bus.js');
var yashSimpleEventBus = new YashSimpleEventBus();
yashSimpleEventBus.addEventListener(yashAlerter);

var YashZwaveGateway = require('./yash-zwave-gateway.js');
var yashZwaveGateway = new YashZwaveGateway(zwave, yashSimpleEventBus);

yashZwaveGateway.start();

process.on('SIGINT', function() {
    yashZwaveGateway.stop();
    console.log("Z-Wave Gateway stopped.");
    process.exit();
});

var YashHttpMessageGateway = require('./yash-http-message-gateway.js');
var yashHttpMessageGateway = new YashHttpMessageGateway();
