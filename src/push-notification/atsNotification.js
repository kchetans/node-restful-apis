import __sendNotification from "./__sendNotification";
import NotificationSchema from "../mongo-models/NotificationSchema";

let atsNotification = {

    sendNotification(subscriber_id, message) {
        __sendNotification.send(subscriber_id, message);
    },

    sendJobCloseNotification(userIdList, subscriber_ids, message) {
        let saveNotification = _.map(userIdList, user_id => {
            return {
                forUser: user_id,
                type: "job_close",
                title: message,
                body: message
            }
        });

        NotificationSchema.insertMany(saveNotification);

        __sendNotification.send(subscriber_ids, {title: message, body: message});
    },

    sendChatPush(subscriber_id, {name, text}){
        __sendNotification.send(subscriber_id, {title: name, body: text});
    },

    sendRequestReviewPush(user, {name}){
        let title = `${name} has asked for review`,
            body = `${name} has asked for review`;
        // saving notification data
        new NotificationSchema({forUser: user._id, type: "review", title, body}).save();
        __sendNotification.send(user.subscriber_id, {title, body});
    },

    sendRequestWrittenPush(user, {name}){
        let title = `${name} has written review`,
            body = `${name} has written review`;
        // saving notification data
        new NotificationSchema({forUser: user._id, type: "review", title, body}).save();
        __sendNotification.send(user.subscriber_id, {title, body});
    },

    // Testing purpose method
    sendTextPush(auth_token, message){
        __sendNotification.send(auth_token, message);
    }

};

export default atsNotification;