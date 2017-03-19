'use strict';

function YashSimpleEventBus() {
    this._eventListeners = [];
}

YashSimpleEventBus.prototype.fireEvent = function(source,time,data) {
    for (var i=0; i< this._eventListeners.length; i++) {
        var eventListener = this._eventListeners[i];
        if (eventListener.onEvent) {
            eventListener.onEvent();
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