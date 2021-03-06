'use strict';

const YASH_DEFAULT_ZWAVE_DEVICE = '/dev/ttyUSB0';

function fireEvent(eventBus, source, body) {
    if (eventBus) {
        eventBus.fireEvent({
            source: source,
            time: new Date(),
            body: body
        });
    }
}

function YashZwaveGateway(zwave, eventBus) {
    this._zwave = zwave;
    this._nodes = [];
    this._eventBus = eventBus;
}

YashZwaveGateway.prototype.start = function() {
    console.log('Connecting to Z-Wave device %s ...', YASH_DEFAULT_ZWAVE_DEVICE);
    var eventBus = this._eventBus;
    var nodes = this._nodes;

    function getNodeName(node, nodeid) {
        if (node.name) {
            return node.name;
        } else if (node.manufacturer || node.product) {
            return [node.manufacturer, node.product].join(' ');
        } else {
            return 'Node '+nodeid;
        }
    }

    fireEvent(eventBus,'Z-Wave Network','Starting up...');

    this._zwave.on('driver ready', function(homeid) {
        console.log('scanning homeid=0x%s...', homeid.toString(16));
    });    

    this._zwave.on('scan complete', function() {
        console.log('scanning complete.');
        fireEvent(eventBus, 'Z-Wave Network','Startup successful, initial network scan complete.');
    });

    this._zwave.on('driver failed', function() {
        console.error('Driver failed.');
        fireEvent(eventBus, 'Z-Wave Network','Driver failed, network not started.');
    });

    var nodes = this._nodes;

    this._zwave.on('node ready', function(nodeid, nodeinfo) {
        console.log('===> Node ready! nodeid=%d', nodeid);
        var node = nodes[nodeid];
        if (node) {
            console.log('Node (id=%d, name=%s) ready', nodeid, node.name);
            node.manufacturer = nodeinfo.manufacturer;
            node.manufacturerid = nodeinfo.manufacturerid;
            node.product = nodeinfo.product;
            node.producttype = nodeinfo.producttype;
            node.productid = nodeinfo.productid;
            node.type = nodeinfo.type;
            node.name = nodeinfo.name;
            node.loc = nodeinfo.loc;
            node.ready = true;
        }
    });

    this._zwave.on('value added', function(nodeid, comclass, value) {
        console.log('===> Value added! nodeid=%d, comclass=%d, value=%s', nodeid, comclass, value);
        var node = nodes[nodeid];
        if (node) {
            console.log('Node (id=%d, name=%s) commclass %d value added: %s= %s',
                nodeid,
                node.name,
                comclass,
                value.label,
                value.value
            );
            if (!node.classes[comclass]) {
                node.classes[comclass] = {};
            }
            node.classes[comclass][value.index] = value;
        }
    });

    this._zwave.on('value changed', function(nodeid, comclass, value) {
        console.log('===> Value changed! nodeid=%d, comclass=%d, value=%s', nodeid, comclass, value);
        var node = nodes[nodeid];
        if (node) {
            var oldValue = node.classes[comclass][value.index].value;
            console.log('Node (id=%d, name=%s) commclass %d value changed: %s= %s -> %s',
                nodeid,
                node.name,
                comclass,
                value.label,
                oldValue,
                value.value
            );
            node.classes[comclass][value.index] = value;
            if (node.ready && value.value != oldValue) {
                fireEvent(
                    eventBus,
                    getNodeName(node, nodeid),
                    'Value '+value.label+' changed from '+oldValue+' to '+value.value+'.'
                );
            }
        }
    });

    this._zwave.on('node event', function(nodeid, data) {
        console.log('===> Node event! nodeid=%d, data=%d', nodeid, data);
        console.log(data);
    });

    this._zwave.on('node added', function(nodeid) {
        console.log('===> Node added! nodeid=%d', nodeid);
        nodes[nodeid] = {
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
    });

    this._zwave.connect(YASH_DEFAULT_ZWAVE_DEVICE);

};

YashZwaveGateway.prototype.stop = function() {
    this._zwave.disconnect(YASH_DEFAULT_ZWAVE_DEVICE);
    fireEvent(this._eventBus, 'Z-Wave Network', 'Stopped.');
};

YashZwaveGateway.prototype.getNodes = function() {
    return this._nodes;
};

module.exports = YashZwaveGateway;
