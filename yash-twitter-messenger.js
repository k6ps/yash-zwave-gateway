'use strict';

function YashTwitterMessenger() {}

YashTwitterMessenger.prototype.sendMessage = function(source, content) {
    console.log('Sending message from %s: %s', source, content);
};

module.exports = YashTwitterMessenger;