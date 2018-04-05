import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import NotificationSchema from "../../../mongo-models/NotificationSchema";
import ATSNotification from "../../../push-notification/atsNotification";
import chalk from "chalk";
import format from "string-template";
import {
    EMPLOYEE_ACCEPT_OFFER_LETTER,
    EMPLOYEE_ACCEPTS_INTEREST,
    EMPLOYEE_RECEIVES_INTEREST,
    EMPLOYEE_REJECT_OFFER_LETTER,
    EMPLOYEE_REJECTS_INTEREST,
    EMPLOYER_RECEIVES_APPLICATION,
    EMPLOYER_REJECT_APPLICATION,
    EMPLOYER_SENDS_OFFER_LETTER,
    EMPLOYER_SHORTLIST_APPLICATION
} from "../../../constants/notification-messages";

import chatSocket from "../chats/chat-socket-method";
let sendPush = {

    async __saveAndSendPush(forUser, body, {type = 'type', title = "Workex"}){
        let {subscriber_id} = await  UserProfileDataManager.findOne({_id: forUser}, ['subscriber_id']) || {};
        // sending notifications to employee
        if (subscriber_id) {
            if (title && title.length > 0) {
                let notificationContent = {title, body};
                ATSNotification.sendNotification(subscriber_id, {title, body});
            } else {
                console.error(chalk.red("Error occurred. Missing title in notification."));
            }
        } else {
            console.error(chalk.red("Couldn't find the subscriber id."), title, body);
        }
        // saving notification data
        let notification = await new NotificationSchema({forUser, type, title, body}).save();

        //send push notification on socket
        chatSocket.sendNotificationOnSocket(forUser, {title, body, notification_id: notification._id});

    },

};

let afterJobApplication = {
    /**
     *
     * @param employee_id  => id of person to whome you want to send notification
     * @param user_name => name for person who has done action.
     * @param job_title
     * @returns {Promise.<void>}
     */
    async afterErInterested(employee_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employee_id, format(EMPLOYEE_RECEIVES_INTEREST, {user_name, job_title}), {});
    },

    async afterEeNotInterested(employer_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employer_id, format(EMPLOYEE_REJECTS_INTEREST, {user_name, job_title}), {});
    },

    async afterEeInterested(employer_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employer_id, format(EMPLOYEE_ACCEPTS_INTEREST, {user_name, job_title}), {});
    },

    async afterEeApply(employer_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employer_id, format(EMPLOYER_RECEIVES_APPLICATION, {
            user_name,
            job_title
        }), {});
    },

    async afterErReject(employee_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employee_id, format(EMPLOYER_REJECT_APPLICATION, {user_name, job_title}), {});
    },

    async afterErShortList(employee_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employee_id, format(EMPLOYER_SHORTLIST_APPLICATION, {
            user_name,
            job_title
        }), {});
    },

    async afterErSendOfferLetter(employee_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employee_id, format(EMPLOYER_SENDS_OFFER_LETTER, {user_name, job_title}), {});
    },

    async afterEeAcceptOfferLetter(employer_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employer_id, format(EMPLOYEE_ACCEPT_OFFER_LETTER, {user_name, job_title}), {});
    },

    async afterEeRejectOfferLetter(employer_id, user_name, job_title) {
        await sendPush.__saveAndSendPush(employer_id, format(EMPLOYEE_REJECT_OFFER_LETTER, {user_name, job_title}), {});
    }
};

export default afterJobApplication;