/**
 * Created By KARTIK AGARWAL
 * on 11 Jun 2017
 */
import request from "request-promise";
let config = require("config");
let fcmApiKey = config.get("fcmApiKey");

let FCM_ULR = "https://fcm.googleapis.com/fcm/send";
let DEFAULT_OPTIONS = {
    priority: 'high',
};

/**
 * TODO do this task in child process
 * @type {{send: ((registrationTokens?, message, options?))}}
 */
let sendNotification = {

    //TODO time_to_live
    send(registrationTokens = [], {title, body}, options = DEFAULT_OPTIONS){
        console.log("registrationTokens", registrationTokens);
        if (Array.isArray(registrationTokens)) {
            _.forEach(registrationTokens, registrationToken => {
                sendNotification.send(registrationToken, {title, body}, options);
            })
        } else {
            if (typeof  registrationTokens == 'string')
                request({
                    uri: FCM_ULR,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `key=${fcmApiKey}`
                    },
                    body: {
                        "to": registrationTokens,
                        "notification": {
                            title, body,
                            sound: "default",
                            icon: "https://s3.ap-south-1.amazonaws.com/wx-logo/logo_original_icon.png  "
                        },
                        "data": {
                            "notification": {
                                title, body
                            },
                            "test-key-1": "test-value-1"
                        }
                    },
                    json: true
                }).then(response => {
                    console.log("Send Push res", response);
                }).catch(err => {
                    //TODO send mail
                    console.log("err", err);
                });
            else
                console.log("subscriber_id is must be String");
        }
    }
};

export default  sendNotification;