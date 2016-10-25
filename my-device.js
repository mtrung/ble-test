var NobleDevice = require('noble-device');

var YOUR_THING_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb';
var YOUR_THING_NOTIFY_CHAR  = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var YOUR_THING_READ_CHAR    = '2a25';
var YOUR_THING_WRITE_CHAR   = 'xxxxxxxxxxxxxxxxxxxxxxxx';

// then create your thing with the object pattern
var YourThing = function(peripheral) {
  // call nobles super constructor
  NobleDevice.call(this, peripheral);

  // setup or do anything else your module needs here
};

// tell Noble about the service uuid(s) your peripheral advertises (optional)
// YourThing.SCAN_UUIDS = [YOUR_THING_SERVICE_UUID];

// and/or specify method to check peripheral (optional)
// YourThing.is = function(peripheral) {
//   // return (peripheral.advertisement.localName === 'Bose QuietComfort 35');
//   return (peripheral.advertisement.localName && 
//     peripheral.advertisement.localName.indexOf('Bose') >= 0);
// };

// inherit noble device
NobleDevice.Util.inherits(YourThing, NobleDevice);
// NobleDevice.Util.mixin(YourThing, NobleDevice.BatteryService);
NobleDevice.Util.mixin(YourThing, NobleDevice.DeviceInformationService);

// you could send some data
// YourThing.prototype.send = function(data, done) {
//   this.writeDataCharacteristic(YOUR_THING_SERVICE_UUID, YOUR_THING_WRITE_CHAR, data, done);
// };

// // read some data
// YourThing.prototype.receive = function(callback) {
//   this.readStringCharacteristic(YOUR_THING_SERVICE_UUID, YOUR_THING_READ_CHAR, callback);
// };

YourThing.prototype.connectAndSetup = function (callback) {
  NobleDevice.prototype.connectAndSetup.call(this, function (error) {
    // maybe notify on a characteristic ?
    //   this.notifyCharacteristic(YOUR_THING_SERVICE_UUID, YOUR_THING_NOTIFY_CHAR, true, this._onRead.bind(this), function(err) {
    //     callback(err);
    //   });
    var services = this._peripheral.services;
    if (services) {
      Object.keys(services).forEach(function (key) {
        console.log('   Service ' + services[key]);
      });

      this.readModelNumber(function (error, data) {
        console.log('   readModelNumber ' + data);
        this.readSerialNumber(function (error, data) {
          console.log('   readSerialNumber ' + data);
          this.disconnect();
        });
      });
    }

  }).bind(this);
};

// YourThing.prototype.onDisconnect = function() {
//   // clean up ...

//   // call super's onDisconnect
//   NobleDevice.prototype.onDisconnect.call(this);
// };



// export your device
module.exports = YourThing;
