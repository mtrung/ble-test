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
    YourThing.stopDiscoverAll(function (device1) {
        console.log("- stopDiscover: " + device1._peripheral.advertisement.localName + ' ' + device1.address);
    });

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

function discoverServicesAndCharacteristics(device, readCharMode) {
    if (!device || !device._peripheral || !readCharMode)
        return;

    var services = device._peripheral.services;
    for (var i in services) {
        var service = services[i];
        if (readCharMode === 1) console.log('\n   - Service ' + service);

        if (readCharMode === 1) readStack[device.address+service.uuid] = service.characteristics.length();
        else if (readCharMode === 2) readStack[device.address+service.uuid] = 2;

        for (var j in service.characteristics) {
            var characteristic = service.characteristics[j];
            if (readCharMode === 1) console.log('      Characteristic ' + characteristic);
            if (readCharMode && characteristic.properties.indexOf('read') >= 0) {
                readCharacter(device, service, characteristic, readCharMode);
            }
        }
    }
}

function readCharacterCb(device, service, characteristic, data, error) {
    if (error) {
        //device.disconnect();
        return;
    }
    var serviceName = service.name || service.uuid;
    var charName = characteristic.name || characteristic.uuid;
    var key = device.address+service.uuid;

    console.log(readStack[key] +': '+ device._peripheral.advertisement.localName + '.' + serviceName + '.' + charName + ': ' + data.toString());
    //device.disconnect();

    if (readStack[key]) {
        readStack[key] = readStack[key] - 1;
        if (readStack[key] === 0) {
            device.disconnect();
        }
    } 
}

var readStack = {};

function readCharacter(device, service, characteristic, readCharMode) {
    if (readCharMode === 1) {
        // var key = service.uuid;
        // if (readStack[key]) {
        //     readStack[key] = readStack[key] + 1;
        // } else readStack[key] = 0;

        device.readDataCharacteristic(service.uuid, characteristic.uuid, function (error, data) {
            readCharacterCb(device, service, characteristic, data, error);
        });
    } else if (readCharMode === 2) {
        if (service.uuid === '180a' && (characteristic.uuid === '2a25') || characteristic.uuid === '2a26') {
            // var key = service.uuid;
            // if (readStack[key]) {
            //     readStack[key] = readStack[key] + 1;
            // } else readStack[key] = 0;

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
