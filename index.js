var YourThing = require('./my-device.js');

YourThing.discoverAll(onDiscover);

function onDiscover(device) {
    // you can be notified of disconnects
    device.on('disconnect', function () {
        console.log('we got disconnected! ');
    });

    var localName = device._peripheral.advertisement.localName;
    console.log("- onDiscover: " + device.id + ' ' + device.address + ' rssi=' + device._peripheral.rssi 
        + ', localName:' + localName
    );

    if (localName && localName.indexOf('RMM') >= 0) {
        device.connectAndSetUp(function (error) {            
            onConnected(device);
        });
    }
    return true;
}

function onConnected(device) {
    console.log("- onConnect: " + device.id + ' ' + device.address + ', name:' + device._peripheral.advertisement.localName);

    device.discoverServicesAndCharacteristics(function() {
        if (device._services) {
            Object.keys(device._services).forEach(function (key) {
                console.log(key + " = " + device._services[key]);
            });
        }
    });
    // yourThing.send(new Buffer([0x00, 0x01]), function() {
    //   console.log('data sent');
    // });

    // yourThing.receive(function(error, data) {
    //   console.log('got data: ' + data);
    // });
    
    //device.disconnect();
}
