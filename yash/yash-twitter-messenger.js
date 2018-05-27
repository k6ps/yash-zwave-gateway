'use strict';

function YashTwitterMessenger(twitter) {
    this._twitter = twitter;
}

YashTwitterMessenger.prototype.sendMessage = function(source, content) {

    function truncateTweetContent(tweetContent) {
        const MAX_LENGTH = 140;
        if (tweetContent.length > MAX_LENGTH) {
            return tweetContent.substr(0,MAX_LENGTH-3).concat('...');
        } else {
            return tweetContent;
        }
    }

    console.log('Sending message via Twitter: %s: %s', source, content);
    if (this._twitter) {
        var tweetContent = truncateTweetContent(source + ': ' + content);
        this._twitter.post('statuses/update', {status: tweetContent}, function(error, tweet, response) {
            if(error) {
                console.log('Failed to send message via Twitter.');
                console.log(error);
            } else {
                console.log('Successfully sent message via Twitter.');
            };
        });
    }
};

module.exports = YashTwitterMessenger;