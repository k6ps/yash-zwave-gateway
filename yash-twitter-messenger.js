'use strict';

function YashTwitterMessenger(twitter) {
    this._twitter = twitter;
}

YashTwitterMessenger.prototype.sendMessage = function(source, content) {
    console.log('Sending message via Twitter: %s: %s', source, content);
    if (this._twitter) {
        this._twitter.post('statuses/update', {status: source + ': ' + content}, function(error, tweet, response) {
            if(error) {
                console.log('Failed to send message via Twitter.');
                console.error(error);
            } else {
                console.log('Successfully sent message via Twitter.');
            };
        });
    }
};

module.exports = YashTwitterMessenger;