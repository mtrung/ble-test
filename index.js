var YourThing = require('./my-device.js');
var Promise = require('promise');

YourThing.discoverAll(onDiscover);

function onDiscover(device) {
    // you can be notified of disconnects
    device.on('disconnect', function () {
        console.log("- onDisconnect: " + device._peripheral.advertisement.localName + ' ' + device.address);
    });

    var localName = device._peripheral.advertisement.localName;
    console.log("- onDiscover: " + device._peripheral.advertisement.localName + ' ' + device.address);
    YourThing.stopDiscoverAll(function (device1) {
        console.log("- stopDiscover: " + device1._peripheral.advertisement.localName + ' ' + device1.address);
    });

    if (localName && localName.indexOf('Q') >= 0) {
        device.connectAndSetUp(function (error) {
            onConnected(device);
        });
    }
    return true;
}

function recurse(device, i) {
    if (i > 30) return;
    device.readFirmwareRevision(function (error, data) {
        console.log('   ' + i + ': readFirmwareRevision=' + data);
        device.readModelNumber(function (error, data) {
            console.log('   readModelNumber ' + data);
            device.readSerialNumber(function (error, data) {
                console.log('   readSerialNumber ' + data);
                recurse(device, ++i);
            });
        });
    });
}

function onConnected(device) {
    console.log("- onConnected: " + device._peripheral.advertisement.localName + ' ' + device.address);
    recurse(device, 0);
    //device.disconnect();
}
