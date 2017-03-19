'use strict';

function YashAlerter(messenger) {
    this._messenger = messenger;
}

YashAlerter.prototype.onEvent = function(event) {
    if (this._messenger) {
        if (event.source && event.body) {
            this._messenger.sendMessage(event.source, event.body);
        }
    }
}

module.exports = YashAlerter;