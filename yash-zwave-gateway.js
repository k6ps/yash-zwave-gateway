function YashZwaveGateway(zwave) {
    this._zwave = zwave;
}

YashZwaveGateway.prototype.start = function() {
    this._zwave.connect('/dev/ttyUSB0');
};

YashZwaveGateway.prototype.stop = function() {
    this._zwave.disconnect('/dev/ttyUSB0');
};

module.exports = YashZwaveGateway;
