import JobsUiManager from "./jobs";
import {JOB_APPLICATION_STATE} from "../constants/application";
import {
    CARD_TEMPLATE_JOB_APPLICATION,
    CARD_TEMPLATE_JOB_INTEREST,
    CARD_TEMPLATE_NOTIFICATION,
    CARD_TEMPLATE_OFFER_LETTER,
    NOTIFICATION_TYPE_APPLIED,
    NOTIFICATION_TYPE_INTERESTED,
    NOTIFICATION_TYPE_JOB_CLOSED,
    NOTIFICATION_TYPE_MATCHED,
    NOTIFICATION_TYPE_NOT_INTERESTED,
    NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED,
    NOTIFICATION_TYPE_OFFER_LETTER_REJECTED,
    NOTIFICATION_TYPE_OFFER_LETTER_SENT,
    NOTIFICATION_TYPE_REJECTED,
    NOTIFICATION_TYPE_SHORTLISTED
} from "../apis/workexnow/chats/chat-constants";

let a = {

    getFormatedActiveJobs(jobsApplications){
        let shortlist = [];
        let reject = [];
        let offer_letter = [];

        _.map(jobsApplications, jobsApplication => {
            let {title, job_id, job_application_id, state} = jobsApplication;

            reject.push(jobsApplication);
            offer_letter.push(jobsApplication);

            switch (state) {
                case  JOB_APPLICATION_STATE.applied :
                    shortlist.push(jobsApplication);
            }
        });

        return {
            shortlist,
            reject,
            offer_letter
        }
    },

    getChatMessageData(chatMessage){
        if (Array.isArray(chatMessage)) {
            chatMessage = _.map(chatMessage, chatMessageItem => a.getData(chatMessageItem))
        } else {
            chatMessage = a.getData(chatMessage)
        }
        return chatMessage;
    },

    getData(chatMessage){
        if (chatMessage.template === "card") {
            try {
                chatMessage = JSON.parse(chatMessage);
            } catch (err) {

            }
            chatMessage.card.type_text = JobsUiManager.getReaadableJobType(chatMessage.card.type);
            chatMessage.card.status_text = getUiTitle(chatMessage.card.status);
        }
        return chatMessage;
    }
};

let getUiTitle = (type) => {
    switch (type) {
        case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED:
            return "Offer Letter Rejected";
        case NOTIFICATION_TYPE_JOB_CLOSED:
            return "Job Closed";
        case NOTIFICATION_TYPE_MATCHED:
            return "Matched";
        case NOTIFICATION_TYPE_REJECTED:
            return "Rejected";
        case NOTIFICATION_TYPE_APPLIED:
            return "Applied";
        case NOTIFICATION_TYPE_SHORTLISTED:
            return "Shortlisted";
        case NOTIFICATION_TYPE_INTERESTED:
            return "Interested";
        case NOTIFICATION_TYPE_OFFER_LETTER_SENT :
            return "Offer Letter Sent";
        case NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED :
            return "Offer Letter Accepted";
        case NOTIFICATION_TYPE_NOT_INTERESTED :
            return "Not Interested";
        case  CARD_TEMPLATE_JOB_APPLICATION:
            return "Job Application";
        case CARD_TEMPLATE_JOB_INTEREST :
            return "Job Interest";
        case CARD_TEMPLATE_NOTIFICATION:
            return "Notification";
        case CARD_TEMPLATE_OFFER_LETTER :
            return "Offer Letter";
        default :
            return "" + type;
    }
};

export default a;