'use strict';

var ZWave = require('openzwave-shared');
var zwave = new ZWave();
var YashTwitterMessenger = require('./yash-twitter-messenger.js');
var yashTwitterMessenger = new YashTwitterMessenger();
var YashZwaveGateway = require('./yash-zwave-gateway.js');
var yashZwaveGateway = new YashZwaveGateway(zwave, yashTwitterMessenger);

yashZwaveGateway.start();

process.on('SIGINT', function() {
    yashZwaveGateway.stop();
    console.log("Z-Wave Gateway stopped.");
    process.exit();
});