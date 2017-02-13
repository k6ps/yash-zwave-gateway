'use strict';

const YASH_DEFAULT_ZWAVE_DEVICE='/dev/ttyUSB0';

function YashZwaveGateway(zwave) {
    this._zwave = zwave;
    this._nodes = [];
}

YashZwaveGateway.prototype.start = function(successCallback, failureCallback) {
    console.log('Connecting to Z-Wave device %s ...', YASH_DEFAULT_ZWAVE_DEVICE)
    this._startSuccessCallback = successCallback;
    this._startFailureCallback = failureCallback;
    this._zwave.connect(YASH_DEFAULT_ZWAVE_DEVICE);
    this._startSuccessCallback();
};

YashZwaveGateway.prototype.stop = function() {
    this._zwave.disconnect(YASH_DEFAULT_ZWAVE_DEVICE);
};

YashZwaveGateway.prototype.getNodes = function() {
    return this._nodes;
};

YashZwaveGateway.prototype.addNode = function(nodeId) {
    this._nodes[nodeId] = {
        manufacturer: '',
        manufacturerid: '',
        product: '',
        producttype: '',
        productid: '',
        type: '',
        name: '',
        loc: '',
        classes: {},
        ready: false
    };
};

module.exports = YashZwaveGateway;
