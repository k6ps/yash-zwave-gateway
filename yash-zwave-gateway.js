'use strict';

const YASH_DEFAULT_ZWAVE_DEVICE='/dev/ttyUSB0';

function YashZwaveGateway(zwave) {
    this._zwave = zwave;
}

YashZwaveGateway.prototype.start = function() {
    this._zwave.connect(YASH_DEFAULT_ZWAVE_DEVICE);
};

YashZwaveGateway.prototype.stop = function() {
    this._zwave.disconnect(YASH_DEFAULT_ZWAVE_DEVICE);
};

module.exports = YashZwaveGateway;
