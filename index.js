var YourThing = require('./my-device.js');
var Promise = require('promise');

YourThing.discoverAll(onDiscover);

function onDiscover(device) {
    // you can be notified of disconnects
    device.on('disconnect', function () {
        console.log(" -- onDisconnect: " + device._peripheral.advertisement.localName + ' ' + device.address);
    });

    var localName = device._peripheral.advertisement.localName;
    console.log("- onDiscover: " + device._peripheral.advertisement.localName + ' ' + device.address);
    // YourThing.stopDiscoverAll(function (device1) {
    //     console.log("- stopDiscover: " + device1._peripheral.advertisement.localName + ' ' + device1.address);
    // });

    // if (localName && localName.indexOf('Q') >= 0) 
    {
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

var readStack = {};

function discoverServicesAndCharacteristics(device, readCharMode) {
    if (!device || !device._peripheral || !readCharMode)
        return;

    var services = device._peripheral.services;
    readStack[device.address] = 0;

    for (var i in services) {
        var service = services[i];
        if (readCharMode && readCharMode === 1) console.log('\n   - Service ' + service.name + ' ' + service.uuid);
        for (var j in service.characteristics) {
            var characteristic = service.characteristics[j];
            if (readCharMode && readCharMode === 1) console.log('      Characteristic ' + characteristic);
            readCharacter(device, service, characteristic, readCharMode);
        }
    }

    if (readStack[device.address] === 0) {
        // console.log(" -- disconnect: " + device._peripheral.advertisement.localName + ' ' + device.address);
        device.disconnect();
    }
}

function readCharacterCb(device, service, characteristic, data, error) {
    if (readStack[device.address]) {
        readStack[device.address]--;
        if (readStack[device.address] === 0) {
            // console.log(" -- disconnect: " + device._peripheral.advertisement.localName + ' ' + device.address);
            device.disconnect();
        }
    }

    if (error) {
        return;
    }
    var serviceName = service.name || service.uuid;
    var charName = characteristic.name || characteristic.uuid;
    console.log(readStack[device.address] +': '+ device._peripheral.advertisement.localName + '.' + serviceName + '.' + charName + ': ' + data.toString());
}

function readCharacter(device, service, characteristic, readCharMode) {
    if (!readCharMode || characteristic.properties.indexOf('read') < 0) {
        return;
    }

    if (readCharMode === 1) {
        readStack[device.address]++;
        device.readDataCharacteristic(service.uuid, characteristic.uuid, function (error, data) {
            readCharacterCb(device, service, characteristic, data, error);
        });
    } else if (readCharMode === 2) {
        if (service.uuid === '180a' && (characteristic.uuid === '2a25') || characteristic.uuid === '2a26') {
            readStack[device.address]++;
            device.readDataCharacteristic(service.uuid, characteristic.uuid, function (error, data) {
                readCharacterCb(device, service, characteristic, data, error);
            });
        }
    }
}

function onConnected(device) {
    console.log(" - onConnected: " + device._peripheral.advertisement.localName + ' ' + device.address);
    // recurse(device, 0);
    discoverServicesAndCharacteristics(device, 2);            
    //device.disconnect();
}
