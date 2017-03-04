'use strict';

const YASH_DEFAULT_ZWAVE_DEVICE = '/dev/ttyUSB0';

function YashZwaveGateway(zwave, messenger) {
    this._zwave = zwave;
    this._nodes = [];
    this._messenger = messenger;
}

YashZwaveGateway.prototype.start = function() {
    console.log('Connecting to Z-Wave device %s ...', YASH_DEFAULT_ZWAVE_DEVICE);
    var messenger = this._messenger;
    if (messenger) {
        messenger.sendMessage('Z-Wave Network','Starting up...');
    }

    this._zwave.on('driver ready', function(homeid) {
        console.log('scanning homeid=0x%s...', homeid.toString(16));
    });    

    this._zwave.on('scan complete', function() {
        console.log('scanning complete.');
        if (messenger) {
            messenger.sendMessage('Z-Wave Network','Startup successful, initial network scan complete.');
        }
    });

    this._zwave.on('driver failed', function() {
        console.error('Driver failed.');
        if (messenger) {
            messenger.sendMessage('Z-Wave Network','Driver failed, network not started.');
        }
    });

    var nodes = this._nodes;

    this._zwave.on('node ready', function(nodeid, nodeinfo) {
        console.log('Node ready: '+nodeid);
        if (nodes[nodeid]) {
            nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
            nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
            nodes[nodeid]['product'] = nodeinfo.product;
            nodes[nodeid]['producttype'] = nodeinfo.producttype;
            nodes[nodeid]['productid'] = nodeinfo.productid;
            nodes[nodeid]['type'] = nodeinfo.type;
            nodes[nodeid]['name'] = nodeinfo.name;
            nodes[nodeid]['loc'] = nodeinfo.loc;
            nodes[nodeid]['ready'] = true;
        }
    });

    this._zwave.on('value added', function(nodeid, comclass, value) {
        if (!nodes[nodeid]['classes'][comclass])
            nodes[nodeid]['classes'][comclass] = {};
        nodes[nodeid]['classes'][comclass][value.index] = value;
    });

    this._zwave.connect(YASH_DEFAULT_ZWAVE_DEVICE);

};

YashZwaveGateway.prototype.stop = function() {
    this._zwave.disconnect(YASH_DEFAULT_ZWAVE_DEVICE);
    if (this._messenger) {
        this._messenger.sendMessage('Z-Wave Network','Stopped.');
    }
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
