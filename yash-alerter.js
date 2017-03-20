'use strict';

function YashAlerter(messenger) {
    this._messenger = messenger;
    this._ignoredSources = [];
}

YashAlerter.prototype.onEvent = function(event) {
    if (this._messenger) {
        if (event.source && event.body) {
            if (this._ignoredSources.indexOf(event.source) < 0) {
                this._messenger.sendMessage(event.source, event.body);
            }
        }
    }
}

YashAlerter.prototype.addIgnoredEventSource = function(eventSource) {
    this._ignoredSources.push(eventSource);
}

module.exports = YashAlerter;