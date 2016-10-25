var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var BatteryLevelCharacteristic = require('./battery-level-characteristic');

function BatteryService() {
  BatteryService.super_.call(this, {
      uuid: '0000180f-0000-1000-8000-00805f9b34fb',//  '180F',
      characteristics: [
          new BatteryLevelCharacteristic()
      ]
  });
}

util.inherits(BatteryService, BlenoPrimaryService);

module.exports = BatteryService;
