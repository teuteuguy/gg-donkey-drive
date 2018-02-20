'use strict';

console.log('Top of the function');

const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;
const names = require("./device-names.json");
 
var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

var pwm = new Pca9685Driver(options, function(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");
});

function getTopicFromContext(context) {
    if (context !== undefined && context.clientContext !== undefined && context.clientContext.Custom !== undefined && context.clientContext.Custom.subject !== undefined) {
      return context.clientContext.Custom.subject;
    } else {
      return false;
    }
}

function getReportedStateFromEvent(event) {
    if (event !== undefined && event.state !== undefined && event.state.reported !== undefined) {
      return event.state.reported;
    } else {
      return false;
    }
}

exports.handler = function (event, context, callback) {

    var topic = getTopicFromContext(context);
    var reported = getReportedStateFromEvent(event);

    if (topic) {
      switch (topic) {        
        case "$aws/things/" + names.core + "/shadow/update/accepted":
          if (reported) {
            console.log("Received new shadow data:", reported);
          }
          break;
        default:
          console.log("Unknown topic:", topic);
      }
    }

    callback(null, "Hello from lambda");

};


