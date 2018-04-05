let config = require("config");
let gcm = require('node-gcm');
let fcmApiKey = config.get("fcmApiKey");

let pushNotification;

/** Expose all models */
exports = module.exports;

exports.init = function init() {
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
    pushNotification = new gcm.Sender(fcmApiKey);
    return Promise.resolve(true);
};

// expose mongoose connection object
module.exports.pushNotification = pushNotification;
