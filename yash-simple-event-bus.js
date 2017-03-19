'use strict';

function YashSimpleEventBus() {
    this._eventListeners = [];
}

YashSimpleEventBus.prototype.fireEvent = function(event) {
    for (var i=0; i< this._eventListeners.length; i++) {
        var eventListener = this._eventListeners[i];
        if (eventListener.onEvent) {
            eventListener.onEvent(event);
        }
    }
}

YashSimpleEventBus.prototype.addEventListener = function(listener) {
    this._eventListeners.push(listener);
}

YashSimpleEventBus.prototype.getEventListeners = function() {
    return this._eventListeners;
}

module.exports = YashSimpleEventBus;