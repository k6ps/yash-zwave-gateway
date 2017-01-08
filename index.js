'use strict';

var ZWave = require('openzwave-shared');
var zwave = new ZWave();
var YashZwaveGateway = require('./yash-zwave-gateway.js');
var yashZwaveGateway = new YashZwaveGateway(zwave);

yashZwaveGateway.start();

process.on('SIGINT', function() {
    yashZwaveGateway.stop();
    process.exit();
});