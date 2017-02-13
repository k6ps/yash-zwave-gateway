'use strict';

var ZWave = require('openzwave-shared');
var zwave = new ZWave();
var YashZwaveGateway = require('./yash-zwave-gateway.js');
var yashZwaveGateway = new YashZwaveGateway(zwave);

yashZwaveGateway.start(function() {
    console.log("Z-Wave Gateway started successfuly.");
}, function() {
    console.log("Failed to start Z-Wave Gateway.");
});

process.on('SIGINT', function() {
    yashZwaveGateway.stop();
    process.exit();
});