import socketLog from "./socket-log";
import ChatUiManager from "../../../ui-manager/chats";

/* Chat message status constants */
export const CHAT_STATUS_SENT = 1;
export const CHAT_STATUS_DELIVERED = 2;
export const CHAT_STATUS_SEEN = 3;

/*Chat card type */
export const CARD_TEMPLATE_NOTIFICATION = "notification";
export const CARD_TEMPLATE_OFFER_LETTER = "offer_letter";
export const CARD_TEMPLATE_JOB_INTEREST = "job_interest";
export const CARD_TEMPLATE_APPLY = "job_application";
export const CARD_TEMPLATE_JOB_APPLICATION = "job_application";
export const CARD_TEMPLATE_JOB_INTERVIEW = "job_interview";

export const NOTIFICATION_TYPE_OFFER_LETTER_SENT = "offer_letter_sent";
export const NOTIFICATION_TYPE_OFFER_LETTER_REJECTED = "offer_letter_rejected";
export const NOTIFICATION_TYPE_OFFER_LETTER_ACCEPTED = "offer_letter_accepted";


export const NOTIFICATION_TYPE_APPLIED = "applied";

export const NOTIFICATION_TYPE_MATCHED = "matched";
export const NOTIFICATION_TYPE_INTEREST_ACCEPTED = "matched";
export const NOTIFICATION_TYPE_SHORTLISTED = "shortlisted";
export const NOTIFICATION_TYPE_REJECTED = "rejected";

export const NOTIFICATION_TYPE_INTERESTED = "interested";
export const NOTIFICATION_TYPE_NOT_INTERESTED = "not_interested"; //todo: i hope not need to send chat as on employer end it will not created

export const NOTIFICATION_TYPE_JOB_CLOSED = "job_closed";

export const socket_constants = {
    CHAT: 'chat',
    CHAT_STATUS: 'chat_status',
    USER_STATUS: 'user_status',
    DISCONNECT: 'disconnect',
    OFFER_LETTER: 'offer_letter',
    JOB_APPLICATION_INTEREST: 'job_application', // => Employer end
    JOB_INTEREST: 'job_interest',
    INTERVIEW: 'interview',
    NOTIFICATIONS: 'notifications',
    ATS_UPDATE: 'ats_update',
    CARD_ACTION: 'card_action',
    ECHO: 'echo',
    ERROR: 'error',
};


export const WxSockets = {
    emit(socket, event, data){
        if (socket) {
            if (event === 'chat') {
                data = ChatUiManager.getChatMessageData(data);
            }
            socket.emit(event, data);
            socketLog.logEmit(event, data);
        } else {
            socketLog.logError("user offline");
        }
    },

    broadcast(socket, event, data){
        if (socket) {
            socket.broadcast.emit(event, data);
            socketLog.logEmit(event, data);
        } else {
            socketLog.logError("user offline");
        }
    }
};