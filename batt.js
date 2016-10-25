/*
NOTE: This example no longer works on OSX starting in 10.10 (Yosemite). Apple has apparently blacklisted the battery uuid.
*/

var bleno = require('bleno');
var BatteryService = require('./battery-service');
var DevInfo = require('./device-information-service');

var primaryService = new BatteryService();
var primaryService2 = new DevInfo();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Trung Batt Peri', ['3dda0001-957f-7d4a-34a6-74696673696d']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([primaryService2], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  }
});
