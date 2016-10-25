var YourThing = require('./my-device.js');

YourThing.discoverAll(onDiscover);

function onDiscover(device) {
    // you can be notified of disconnects
    device.on('disconnect', function () {
        console.log("- onDisconnect: " + device._peripheral.advertisement.localName + ' ' + device.address);
    });

    var localName = device._peripheral.advertisement.localName;
    console.log("- onDiscover: " + device._peripheral.advertisement.localName + ' ' + device.address);

    // if (localName && localName.indexOf('Q') >= 0) 
    {
        device.connectAndSetUp(function (error) {
            onConnected(device);
        });
    }
    return true;
}

function onConnected(device) {
    console.log("- onConnected: " + device._peripheral.advertisement.localName + ' ' + device.address);

    var services = device._peripheral.services;
    if (services) {
        Object.keys(services).forEach(function (key) {
            console.log('   Service ' + services[key]);
        });
        // var serviceUuid = '00001812-0000-1000-8000-00805f9b34fb';
        // console.log('--- has 00001812 ' + device.hasService(serviceUuid.toLowerCase()));
        // serviceUuid = '1812';
        // console.log('--- has 1812 ' + device.hasService(serviceUuid.toLowerCase()));
        // serviceUuid = '180A';
        // console.log('--- has 180A ' + device.hasService(serviceUuid.toLowerCase()));
        // serviceUuid = '7905F431-B5CE-4E99-A40F-4B1E122D00D0';
        // console.log('--- has ANCS ' + device.hasService(serviceUuid.toLowerCase()));
    }

    device.disconnect();
}
