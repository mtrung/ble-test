var util = require('util');

var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

var SerialNumberCharacteristic = require('./serial-number-characteristic');
var HardwareRevisionCharacteristic = require('./hardware-revision-characteristic');

function DeviceInformationService(blink1) {
  var blink1 = {
    serialNumber: [0x31,0x32,0x33,0x34,0x35],
    version: [0x30,0x32,0x33]
  }
  DeviceInformationService.super_.call(this, {
    uuid: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristics: [
      new SerialNumberCharacteristic(blink1),
      new HardwareRevisionCharacteristic(blink1)
    ]
  });
}

util.inherits(DeviceInformationService, BlenoPrimaryService);

module.exports = DeviceInformationService;
