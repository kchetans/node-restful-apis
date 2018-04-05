import ChatsSchema from "../../../mongo-models/ChatsMessageSchema";
import JobApplicationDataManger from "../../../data-manager/JobApplicationDataManger";
import JobUiDataManger from "../../../ui-manager/jobs";
import GetJobs from "../jobs/getjob";
import userIdToSocketMap from "./chat-socket-new";
import uuid from "uuid";
import {
    CARD_TEMPLATE_JOB_APPLICATION,
    CARD_TEMPLATE_JOB_INTEREST,
    CARD_TEMPLATE_NOTIFICATION,
    CARD_TEMPLATE_OFFER_LETTER,
    CHAT_STATUS_DELIVERED,
    CHAT_STATUS_SEEN,
    NOTIFICATION_TYPE_APPLIED,
    NOTIFICATION_TYPE_INTEREST_ACCEPTED,
    NOTIFICATION_TYPE_INTERESTED,
    NOTIFICATION_TYPE_JOB_CLOSED,
    NOTIFICATION_TYPE_MATCHED,
    NOTIFICATION_TYPE_NOT_INTERESTED,
    NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED,
    NOTIFICATION_TYPE_OFFER_LETTER_REJECTED,
    NOTIFICATION_TYPE_OFFER_LETTER_SENT,
    NOTIFICATION_TYPE_REJECTED,
    NOTIFICATION_TYPE_SHORTLISTED,
    socket_constants,
    WxSockets
} from "./chat-constants";
import format from "string-template";
import {
    EMPLOYEE_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER,
    EMPLOYEE_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER_TITLE,
    EMPLOYEE_MSG_EMPLOYEE_RECEIVES_INTEREST,
    EMPLOYEE_MSG_EMPLOYEE_RECEIVES_INTEREST_TITLE,
    EMPLOYEE_MSG_EMPLOYEE_REJECT_OFFER_LETTER,
    EMPLOYEE_MSG_EMPLOYEE_REJECT_OFFER_LETTER_TITLE,
    EMPLOYEE_MSG_EMPLOYEE_REJECTS_INTEREST,
    EMPLOYEE_MSG_EMPLOYEE_REJECTS_INTEREST_TITLE,
    EMPLOYEE_MSG_EMPLOYER_RECEIVES_APPLICATION,
    EMPLOYEE_MSG_EMPLOYER_RECEIVES_APPLICATION_TITLE,
    EMPLOYEE_MSG_EMPLOYER_REJECT_APPLICATION,
    EMPLOYEE_MSG_EMPLOYER_REJECT_APPLICATION_TITLE,
    EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER,
    EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE,
    EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION,
    EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION_TITLE,
    EMPLOYER_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER,
    EMPLOYER_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER_TITLE,
    EMPLOYER_MSG_EMPLOYEE_ACCEPTS_INTEREST_TITLE,
    EMPLOYER_MSG_EMPLOYEE_REJECT_OFFER_LETTER,
    EMPLOYER_MSG_EMPLOYEE_REJECT_OFFER_LETTER_TITLE,
    EMPLOYER_MSG_EMPLOYEE_REJECTS_INTEREST,
    EMPLOYER_MSG_EMPLOYEE_REJECTS_INTEREST_TITLE,
    EMPLOYER_MSG_EMPLOYER_RECEIVES_APPLICATION,
    EMPLOYER_MSG_EMPLOYER_RECEIVES_APPLICATION_TITLE,
    EMPLOYER_MSG_EMPLOYER_REJECT_APPLICATION,
    EMPLOYER_MSG_EMPLOYER_REJECT_APPLICATION_TITLE,
    EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER,
    EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE,
    EMPLOYER_MSG_EMPLOYER_SENT_INTEREST,
    EMPLOYER_MSG_EMPLOYER_SENT_INTEREST_TITLE,
    EMPLOYER_MSG_EMPLOYER_SHORTLIST_APPLICATION,
    EMPLOYER_MSG_EMPLOYER_SHORTLIST_APPLICATION_TITLE
} from "../../../constants/notification-messages";
import {JOB_APPLICATION_STATE} from "../../../constants/application";

let getUiTitle = (type) => {
    switch (type) {
        case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED:
            return "Offer Letter Rejected";
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
        case NOTIFICATION_TYPE_JOB_CLOSED:
            return "Job Closed";
        default :
            return "" + type;
    }
};

let notificationCardDisplayText = (card_template, jobApplication, is_title, is_employee) => {
    let {job_posting = {}, user_profile = {}} = jobApplication || {};
    let {company_name, title: job_title, city: job_location = '', type, job_category} = job_posting || {};
    if (is_title) {
        if (is_employee) {
            user_name = '';
            switch (card_template) {
                case NOTIFICATION_TYPE_JOB_CLOSED :
                    return "Job Closed";
                case NOTIFICATION_TYPE_INTEREST_ACCEPTED :
                    return "Job Interest Accepted";
                case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED :
                    return EMPLOYEE_MSG_EMPLOYEE_REJECT_OFFER_LETTER_TITLE;
                case NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED :
                    return EMPLOYEE_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER_TITLE;
                case NOTIFICATION_TYPE_APPLIED :
                    return EMPLOYEE_MSG_EMPLOYER_RECEIVES_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_MATCHED :
                    return EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_SHORTLISTED :
                    return EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_REJECTED :
                    return EMPLOYEE_MSG_EMPLOYER_REJECT_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_INTERESTED :
                    return EMPLOYEE_MSG_EMPLOYEE_RECEIVES_INTEREST_TITLE;
                case NOTIFICATION_TYPE_NOT_INTERESTED :
                    return EMPLOYEE_MSG_EMPLOYEE_REJECTS_INTEREST_TITLE;
                case NOTIFICATION_TYPE_OFFER_LETTER_SENT :
                    return EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE;
                case CARD_TEMPLATE_OFFER_LETTER:
                    return EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE;
                case CARD_TEMPLATE_JOB_INTEREST:
                    return "Job Interest Received";
                default ://todo
                    return card_template;//"THIS IS HAS TO BE IMPLEMENTED...ASK Kartik";
            }
        }
        else {
            user_name = user_profile.name;
            switch (card_template) {
                case NOTIFICATION_TYPE_JOB_CLOSED :
                    return "Job Closed";
                case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED :
                    return EMPLOYER_MSG_EMPLOYEE_REJECT_OFFER_LETTER_TITLE;
                case NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED :
                    return EMPLOYER_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER_TITLE;
                case NOTIFICATION_TYPE_APPLIED :
                    return EMPLOYER_MSG_EMPLOYER_RECEIVES_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_MATCHED :
                    return EMPLOYER_MSG_EMPLOYEE_ACCEPTS_INTEREST_TITLE;
                case NOTIFICATION_TYPE_SHORTLISTED :
                    return EMPLOYER_MSG_EMPLOYER_SHORTLIST_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_REJECTED :
                    return EMPLOYER_MSG_EMPLOYER_REJECT_APPLICATION_TITLE;
                case NOTIFICATION_TYPE_INTERESTED :
                    return EMPLOYER_MSG_EMPLOYER_SENT_INTEREST_TITLE;
                case NOTIFICATION_TYPE_NOT_INTERESTED :
                    return EMPLOYER_MSG_EMPLOYEE_REJECTS_INTEREST_TITLE;
                case NOTIFICATION_TYPE_OFFER_LETTER_SENT :
                    return EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE;
                case CARD_TEMPLATE_OFFER_LETTER:
                    return EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER_TITLE;
                case  CARD_TEMPLATE_JOB_APPLICATION:
                    return EMPLOYER_MSG_EMPLOYER_RECEIVES_APPLICATION_TITLE;
                default ://todo
                    return card_template; //"THIS IS HAS TO BE IMPLEMENTED...ASK Kartik";
            }
        }
    }
    let user_name = '';
    if (is_employee) {
        user_name = '';
        switch (card_template) {
            case NOTIFICATION_TYPE_JOB_CLOSED :
                return "This Job is closed";
            case NOTIFICATION_TYPE_INTEREST_ACCEPTED :
                return "You have Accepted the Job Interest.";
            case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED :
                return format(EMPLOYEE_MSG_EMPLOYEE_REJECT_OFFER_LETTER, {job_title, user_name});
            case NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED :
                return format(EMPLOYEE_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER, {job_title, user_name});
            case NOTIFICATION_TYPE_APPLIED :
                return format(EMPLOYEE_MSG_EMPLOYER_RECEIVES_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_MATCHED :
                return format(EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_SHORTLISTED :
                return format(EMPLOYEE_MSG_EMPLOYER_SHORTLIST_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_REJECTED :
                return format(EMPLOYEE_MSG_EMPLOYER_REJECT_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_INTERESTED :
                return format(EMPLOYEE_MSG_EMPLOYEE_RECEIVES_INTEREST, {job_title, user_name});
            case NOTIFICATION_TYPE_NOT_INTERESTED :
                return format(EMPLOYEE_MSG_EMPLOYEE_REJECTS_INTEREST, {job_title, user_name});
            case NOTIFICATION_TYPE_OFFER_LETTER_SENT :
                return format(EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER, {job_title, user_name});
            case CARD_TEMPLATE_OFFER_LETTER:
                return format(EMPLOYEE_MSG_EMPLOYER_SENDS_OFFER_LETTER, {job_title, user_name});
            case CARD_TEMPLATE_JOB_INTEREST:
                return "You have Received Job Interest";
            default ://todo
                return card_template;//"THIS IS HAS TO BE IMPLEMENTED...ASK Kartik";
        }
    }
    else {
        user_name = user_profile.name;
        switch (card_template) {
            case NOTIFICATION_TYPE_JOB_CLOSED :
                return "This Job is closed";
            case NOTIFICATION_TYPE_OFFER_LETTER_REJECTED :
                return format(EMPLOYER_MSG_EMPLOYEE_REJECT_OFFER_LETTER, {job_title, user_name});
            case NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED :
                return format(EMPLOYER_MSG_EMPLOYEE_ACCEPT_OFFER_LETTER, {job_title, user_name});
            case NOTIFICATION_TYPE_APPLIED :
                return format(EMPLOYER_MSG_EMPLOYER_RECEIVES_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_MATCHED :
                return format(EMPLOYER_MSG_EMPLOYER_SHORTLIST_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_SHORTLISTED :
                return format(EMPLOYER_MSG_EMPLOYER_SHORTLIST_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_REJECTED :
                return format(EMPLOYER_MSG_EMPLOYER_REJECT_APPLICATION, {job_title, user_name});
            case NOTIFICATION_TYPE_INTERESTED :
                return format(EMPLOYER_MSG_EMPLOYER_SENT_INTEREST, {job_title, user_name});
            case NOTIFICATION_TYPE_NOT_INTERESTED :
                return format(EMPLOYER_MSG_EMPLOYEE_REJECTS_INTEREST, {job_title, user_name});
            case NOTIFICATION_TYPE_OFFER_LETTER_SENT :
                return format(EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER, {job_title, user_name});
            case CARD_TEMPLATE_OFFER_LETTER:
                return format(EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER, {job_title, user_name});
            case  CARD_TEMPLATE_JOB_APPLICATION:
                return format(EMPLOYER_MSG_EMPLOYER_SENDS_OFFER_LETTER, {job_title, user_name});
            default ://todo
                return card_template; //"THIS IS HAS TO BE IMPLEMENTED...ASK Kartik";
        }
    }
};

let getNotificationText = (card_template, jobApplication, is_employee) => {
    return notificationCardDisplayText(card_template, jobApplication, false, is_employee);
};

let getNotificationTitle = (card_template, jobApplication, is_employee) => {
    return notificationCardDisplayText(card_template, jobApplication, true, is_employee);
};

/**
 * prepares chat card message
 */
let getChatMessage = async function (job_id, employer_id, employee_id, card_template, pending_action_id, is_employee) {
    let message_guid = uuid();
    let jobApplication = await JobApplicationDataManger.findOneFrom(job_id, employee_id) || {};
    let textEr = undefined;
    let titleEr = undefined;
    let textEE = undefined;
    let titleEE = undefined;
    let status_text = getUiTitle(card_template);
    if (card_template === NOTIFICATION_TYPE_OFFER_LETTER_REJECTED ||
        card_template === NOTIFICATION_TYPE_MATCHED ||
        card_template === NOTIFICATION_TYPE_REJECTED ||
        card_template === NOTIFICATION_TYPE_APPLIED ||
        card_template === NOTIFICATION_TYPE_JOB_CLOSED ||
        card_template === NOTIFICATION_TYPE_SHORTLISTED ||
        card_template === NOTIFICATION_TYPE_INTERESTED ||
        card_template === NOTIFICATION_TYPE_OFFER_LETTER_SENT ||
        card_template === NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED ||
        card_template === NOTIFICATION_TYPE_INTEREST_ACCEPTED ||
        card_template === NOTIFICATION_TYPE_NOT_INTERESTED) {
        textEE = getNotificationText(card_template, jobApplication, true);
        titleEE = getNotificationTitle(card_template, jobApplication, true);
        textEr = getNotificationText(card_template, jobApplication, false);
        titleEr = getNotificationTitle(card_template, jobApplication, false);
        card_template = CARD_TEMPLATE_NOTIFICATION;
    } else {
        //todo : make proper text
        //this text is for chat header list, which contains last messages
        textEE = getNotificationText(card_template, jobApplication, true);
        titleEE = getNotificationTitle(card_template, jobApplication, true);
        textEr = getNotificationText(card_template, jobApplication, false);
        titleEr = getNotificationTitle(card_template, jobApplication, false);
    }
    let {job_posting = {}} = jobApplication || {};
    let {company_name, title: job_title, city: job_location = '', type, category, compensation, cover_pic_url} = job_posting || {};
    category = JobUiDataManger.getCategoryText(category);
    let chatCardER = {
        card_template: card_template,
        text: textEr, title: titleEr,
        compensation, company_name, job_id, job_title,
        job_cover_pic_url: cover_pic_url,
        job_location, type, job_category: category,
        status: card_template, pending_action_id,
        status_text
    };
    let chatCardEE = {
        card_template: card_template,
        text: textEE, title: titleEE,
        job_cover_pic_url: cover_pic_url,
        compensation, company_name, job_id, job_title,
        job_location, type, job_category: category,
        status: card_template, pending_action_id,
        status_text,
    };

    let employerMessage = {
        for_user: employer_id,
        sender: employee_id,
        receiver: employer_id,
        type: "in", // don't know,  but tanya ionic app asked type must be "in" in case of cards
        message_guid,
        template: "card",
        card: chatCardER,
        sent_time: new Date()
    };
    let employeeMessage = {
        for_user: employee_id,
        sender: employer_id,
        receiver: employee_id,
        type: "in",  // don't know,  but tanya ionic app asked type must be "in" in case of cards
        message_guid,
        template: "card",
        card: chatCardEE,
        sent_time: new Date()
    };

    return {employerMessage, employeeMessage};

};

let getChatMessagesSentByEmployer = async function (job_id, employer_id, employee_id, card_template, pending_action_id) {
    return getChatMessage(job_id, employer_id, employee_id, card_template, pending_action_id, false);
};

let getChatMessagesSentByEmployee = async function (job_id, employer_id, employee_id, card_template, pending_action_id) {
    return getChatMessage(job_id, employer_id, employee_id, card_template, pending_action_id, true);
};

let getStatusDisplayText = (state_text) => {
    switch (state_text) {
        case  "shortlisted" :
            return "Shortlisted";
        case  "not-interested" :
            return "Not Interested";
        case  "matched" :
            return "Matched";
        case  "offer_letter_rejected" :
            return "Offer Letter Rejected";
        case  "offer_letter_accepted" :
            return "Offer Letter Accepted";
    }
};

let updateCardStatus = function (chat, new_status) {
    try {
        chat = Object.assign({}, chat.toJSON());
    } catch (err) {
        chat = Object.assign({}, chat);
    }
    if (chat && chat.template === 'card') {
        chat._id = undefined;
        chat.status = 1;
        chat.type = 'card_update';
        chat.card.status = new_status;
        chat.card.status_text = getUiTitle(new_status);
    }
    return chat;
};

let chatEvents = {

    async saveErInterestedCard(job_id, employer_id, employee_id, pendingActionId){
        let {employeeMessage} = await
            getChatMessagesSentByEmployer(job_id, employer_id, employee_id, CARD_TEMPLATE_JOB_INTEREST, pendingActionId);
        let {employerMessage} = await
            getChatMessagesSentByEmployer(job_id, employer_id, employee_id, NOTIFICATION_TYPE_INTERESTED);

        await new ChatsSchema(employeeMessage).save();
        await new ChatsSchema(employerMessage).save();

        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveEeApplyCard(job_id, employer_id, employee_id, pendingActionId){
        let {employerMessage} = await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, CARD_TEMPLATE_JOB_APPLICATION, pendingActionId);
        let {employeeMessage} = await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_APPLIED, pendingActionId);

        await new ChatsSchema(employerMessage).save();
        await new ChatsSchema(employeeMessage).save();

        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveErShortListCard(job_id, employer_id, employee_id, pending_action_id){
        let {employerMessage, employeeMessage} = await getChatMessagesSentByEmployer(job_id, employer_id, employee_id, NOTIFICATION_TYPE_SHORTLISTED);

        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        let chat = await ChatsSchema.findOne({"card.pending_action_id": pending_action_id, for_user: employer_id});

        if (chat) {
            chat = updateCardStatus(chat, NOTIFICATION_TYPE_SHORTLISTED);
            await new ChatsSchema(chat).save();
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', chat);
        }

        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    /**
     * find old msg of employee, update that, emit that,
     * no need to send msg to employer as it will create header on that side to start chat
     */
    async saveEeNotInterestedCard(job_id, employer_id, employee_id, pending_action_id){
        let {employerMessage, employeeMessage} =
            await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_NOT_INTERESTED);
        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            // new ChatsSchema(employeeMessage).save()
        ]);

        let chat = await ChatsSchema.findOne({"card.pending_action_id": pending_action_id, for_user: employee_id});

        if (chat) {
            chat = updateCardStatus(chat, NOTIFICATION_TYPE_NOT_INTERESTED);
            await new ChatsSchema(chat).save();
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', chat);
        }
        // WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    /**
     * create employer message, emit that,
     * find old msg of employee, make copy of that with same message_guid, and updated card status
     */
    async saveEeInterestedCard(job_id, employer_id, employee_id, pending_action_id){
        let {employeeMessage} =
            await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_INTEREST_ACCEPTED);
        let {employerMessage} =
            await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_MATCHED);
        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        let chat = await ChatsSchema.findOne({"card.pending_action_id": pending_action_id, for_user: employee_id});

        if (chat) {
            chat = updateCardStatus(chat, NOTIFICATION_TYPE_MATCHED);
            await new ChatsSchema(chat).save();
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', chat);
        }
        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveErSendOl(job_id, employer_id, employee_id, offer_letter, pendingActionId,
                       pending_action_id_ee, pending_action_id_er){

        let {employeeMessage} = await getChatMessagesSentByEmployer
        (job_id, employer_id, employee_id, CARD_TEMPLATE_OFFER_LETTER, pendingActionId);
        let {employerMessage} = await getChatMessagesSentByEmployer
        (job_id, employer_id, employee_id, NOTIFICATION_TYPE_OFFER_LETTER_SENT);

        if (offer_letter) {
            let {salary, date_of_joining, location} = offer_letter;
            employerMessage.card.compensation = salary;
            employerMessage.card.joining_date = date_of_joining;
            employerMessage.card.job_location = location;

            employeeMessage.card.compensation = salary;
            employeeMessage.card.joining_date = date_of_joining;
            employeeMessage.card.job_location = location;
        }

        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);

        if (pending_action_id_ee) {
            let chat = await ChatsSchema.findOne({
                "card.pending_action_id": pending_action_id_ee,
                for_user: employee_id
            });
            if (chat) {
                chat = updateCardStatus(chat, NOTIFICATION_TYPE_REJECTED);
                await new ChatsSchema(chat).save();
                WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', chat);
            }
        }

        if (pending_action_id_er) {
            let chat = await ChatsSchema.findOne({
                "card.pending_action_id": pending_action_id_er,
                for_user: employer_id
            });
            if (chat) {
                chat = updateCardStatus(chat, NOTIFICATION_TYPE_REJECTED);
                await new ChatsSchema(chat).save();
                WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', chat);
            }
        }
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveErRejected({job_id, employer_id, employee_id, pending_action_id_ee, pending_action_id_er}, prevoiusState){

        let {employerMessage, employeeMessage} = await
            getChatMessagesSentByEmployer(job_id, employer_id, employee_id, NOTIFICATION_TYPE_REJECTED);

        if (prevoiusState === JOB_APPLICATION_STATE.matched) {
            // no update
        } else if (prevoiusState === JOB_APPLICATION_STATE.applied) {
            //update
        } else if (prevoiusState === JOB_APPLICATION_STATE.offer_letter_sent) {
            //update
        }

        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        if (pending_action_id_er) {
            let chat_er = await ChatsSchema.findOne({
                "card.pending_action_id": pending_action_id_er,
                for_user: employer_id
            });
            chat_er = updateCardStatus(chat_er, NOTIFICATION_TYPE_REJECTED);
            await new ChatsSchema(chat_er).save();
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', chat_er);
        }
        if (pending_action_id_ee) {
            let chat_ee = await ChatsSchema.findOne({
                "card.pending_action_id": pending_action_id_ee,
                for_user: employee_id
            });
            chat_ee = updateCardStatus(chat_ee, NOTIFICATION_TYPE_REJECTED);
            await new ChatsSchema(chat_ee).save();
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', chat_ee);
        }

        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveEeAcceptOl(job_id, employer_id, employee_id, pending_action_id){
        let {employerMessage, employeeMessage} =
            await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED);

        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        let chats = await ChatsSchema.find({"card.pending_action_id": pending_action_id});
        let newM1 = {};
        let newM2 = {};
        if (chats && chats[0]) {
            newM1 = updateCardStatus(chats[0], NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED);
            await new ChatsSchema(newM1).save();
        }
        if (chats && chats[1]) {
            newM2 = updateCardStatus(chats[1], NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED);
            await new ChatsSchema(newM2).save();
        }

        if (newM1.for_user == employer_id) {
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', newM1);
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', newM2);
        }
        else {
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', newM2);
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', newM1);
        }

        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async saveEeRejectOl(job_id, employer_id, employee_id, pending_action_id) {
        let {employerMessage, employeeMessage} = await getChatMessagesSentByEmployee(job_id, employer_id, employee_id, NOTIFICATION_TYPE_OFFER_LETTER_REJECTED);

        await Promise.all([
            new ChatsSchema(employerMessage).save(),
            new ChatsSchema(employeeMessage).save()
        ]);

        let chats = await ChatsSchema.find({"card.pending_action_id": pending_action_id});
        let newM1 = {};
        let newM2 = {};
        if (chats && chats[0]) {
            newM1 = updateCardStatus(chats[0], NOTIFICATION_TYPE_OFFER_LETTER_REJECTED);
            await new ChatsSchema(newM1).save();
        }
        if (chats && chats[1]) {
            newM2 = updateCardStatus(chats[1], NOTIFICATION_TYPE_OFFER_LETTER_REJECTED);
            await new ChatsSchema(newM2).save();
        }

        if (newM1.for_user == employer_id) {
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', newM1);
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', newM2);
        }
        else {
            WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', newM2);
            WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', newM1);
        }

        WxSockets.emit(userIdToSocketMap.get(employer_id), 'chat', employerMessage);
        WxSockets.emit(userIdToSocketMap.get(employee_id), 'chat', employeeMessage);
        chatEvents.sendAtsUpdateOnSocket({job_id, employee_id, employer_id});
    },

    async closeAllCardsOfEmployerForJob(pending_actions, job_id, userIdList, employer_id){
        _.map(pending_actions, pending_action => {
            ChatsSchema.find({
                "card.pending_action_id": pending_action,
                "card.card_template": CARD_TEMPLATE_JOB_APPLICATION,
            }).then(chatMessages => {
                _.map(chatMessages, chatMessagesItem => {
                    //close candidate card
                    let newMsg = updateCardStatus(chatMessagesItem, NOTIFICATION_TYPE_JOB_CLOSED);
                    new ChatsSchema(newMsg).save()
                        .then(res => {
                            WxSockets.emit(userIdToSocketMap.get(chatMessagesItem.for_user.toHexString()), 'chat', newMsg);
                        });
                })
            });
        });

        //send job close notification.
        _.map(userIdList, user_id => {
            getChatMessagesSentByEmployer(job_id, employer_id, user_id, NOTIFICATION_TYPE_JOB_CLOSED)
                .then(({employerMessage}) => {
                    new ChatsSchema(employerMessage).save()
                        .then(res => {
                            WxSockets.emit(userIdToSocketMap.get(employer_id.toHexString()), 'chat', employerMessage);
                        });
                });

            GetJobs.erJobInfo(null, {params: {job_id}, user: {_id: user_id}})
                .then(employeePayload => {
                    WxSockets.emit(userIdToSocketMap.get(user_id.toHexString()), socket_constants.ATS_UPDATE, {
                        job_id,
                        data: employeePayload.data
                    });
                });
        });

        let employerPayload = await GetJobs.jobInfo(null, {params: {job_id}, user: {_id: employer_id}});
        WxSockets.emit(userIdToSocketMap.get(employer_id.toHexString()), socket_constants.ATS_UPDATE, {
            job_id,
            data: employerPayload.data
        });

    },

    async closeAllCardsForJob(user_pending_actions, job_id, userIdList, employer_id){

        // close pending card of candidates
        _.map(user_pending_actions, user_pending_action => {
            ChatsSchema.find({
                "card.pending_action_id": user_pending_action,
                "card.card_template": CARD_TEMPLATE_JOB_INTEREST,
            }).then(chatMessages => {
                _.map(chatMessages, chatMessagesItem => {
                    //close candidate card
                    let newMsg = updateCardStatus(chatMessagesItem, NOTIFICATION_TYPE_JOB_CLOSED);
                    new ChatsSchema(newMsg).save()
                        .then(res => {
                            WxSockets.emit(userIdToSocketMap.get(chatMessagesItem.for_user.toHexString()), 'chat', newMsg);
                        });
                })
            });
        });


        //send job close notification to candidate's chat
        _.map(userIdList, user_id => {
            getChatMessagesSentByEmployer(job_id, employer_id, user_id, NOTIFICATION_TYPE_JOB_CLOSED)
                .then(({employeeMessage}) => {
                    new ChatsSchema(employeeMessage).save()
                        .then(res => {
                            WxSockets.emit(userIdToSocketMap.get(user_id.toHexString()), 'chat', employeeMessage);
                        });
                });
        });

    },

    saveChat(info){
        let {sender, receiver, message_guid = "message_guid", text} = info || {};

        let from_msg = {
            for_user: sender, receiver, sender,
            type: 'out', message_guid, text,
            sent_time: new Date()
        };
        let to_msg = {
            for_user: receiver, sender, receiver,
            type: 'in', message_guid, text,
            sent_time: new Date()
        };

        return Promise.all([
            new ChatsSchema(from_msg).save(),
            new ChatsSchema(to_msg).save()
        ]);
    },

    async markAsDelivered(message_guid){
        return await ChatsSchema.update({message_guid}, {$set: {status: CHAT_STATUS_DELIVERED}}, {multi: true});
    },

    async  markAsRead(message_guid){
        return await ChatsSchema.update({message_guid}, {$set: {status: CHAT_STATUS_SEEN}}, {multi: true});
    },

    async sendNotificationOnSocket(forUser, {title, body, notification_id}){
        WxSockets.emit(userIdToSocketMap.get(forUser), socket_constants.NOTIFICATIONS, [{
            title,
            body,
            notification_id
        }]);
    },

    getUndeliveredMsg(user_id){
        return ChatsSchema.find({
            for_user: user_id,
            "type": {$in: ["in", "card_update"]},
            status: 1
        });
    },

    getAllMessages(user_id){
        return ChatsSchema.find({
            for_user: user_id
        });
    },


    async sendAtsUpdateOnSocket({job_id, employee_id, employer_id}){
        try {
            employee_id = employee_id.toHexString();
        } catch (err) {

        }

        try {
            job_id = job_id.toHexString();
        } catch (err) {

        }

        try {
            employer_id = employer_id.toHexString();
        } catch (err) {

        }

        let [employerPayload, employeePayload] = await  Promise.all([
            GetJobs.jobInfo(null, {params: {job_id}, user: {_id: employer_id}}),
            GetJobs.erJobInfo(null, {params: {job_id}, user: {_id: employee_id}})
        ]);

        if (employerPayload.data)
            WxSockets.emit(userIdToSocketMap.get(employer_id), socket_constants.ATS_UPDATE, {
                job_id,
                data: employerPayload.data
            });

        if (employeePayload.data)
            WxSockets.emit(userIdToSocketMap.get(employee_id), socket_constants.ATS_UPDATE, {
                job_id,
                data: employeePayload.data
            });
    }
};

export default  chatEvents;