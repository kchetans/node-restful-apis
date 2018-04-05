import mongoose, {Schema} from "mongoose";
import baseModel from "./base";
import {
    CARD_TEMPLATE_JOB_APPLICATION,
    CARD_TEMPLATE_JOB_INTEREST,
    CARD_TEMPLATE_JOB_INTERVIEW,
    CARD_TEMPLATE_NOTIFICATION,
    CARD_TEMPLATE_OFFER_LETTER
} from "../apis/workexnow/chats/chat-constants";

const Card = new Schema({

    card_template: {
        type: String,
        enum: [
            CARD_TEMPLATE_NOTIFICATION, CARD_TEMPLATE_OFFER_LETTER, CARD_TEMPLATE_JOB_INTEREST,
            CARD_TEMPLATE_JOB_APPLICATION, CARD_TEMPLATE_JOB_INTERVIEW
        ],
        required: true
    },

    // notification text and also in card
    text: {
        type: String
    },

    // notification title and also in card
    title: {
        type: String
    },

    // compensation given
    compensation: {
        type: String
    },

    company_name: {
        type: String
    },

    job_id: {
        type: String
    },

    job_cover_pic_url: {
        type: String
    },

    job_title: {
        type: String
    },

    job_location: {
        type: String
    },

    //job_type
    type: {
        type: String
    },

    job_category: [{
        value: String,
        key: String
    }],

    status: {
        type: String
    },

    joining_date: {
        type: Date
    },

    read: {
        type: String
    },

    delivered: {
        type: String
    },

    pending_action_id: mongoose.Schema.Types.ObjectId,

});

const ChatsMessageSchema = new Schema({

    for_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    type: {
        type: String,
        enum: ["in", "out", "card_update"],
        required: true
    },

    message_guid: {
        type: String,
        required: true
    },

    template: {
        type: String,
        enum: ["text", "audio", "video", "card", "image"],
        default: 'text',
        required: true
    },

    text: {
        type: String
    },

    audio: {
        type: String

    },

    video: {
        type: String
    },

    docs: {
        type: String
    },

    image: {
        type: String
    },

    card: {
        type: Card
    },

    sent_time: {
        type: Date
    },

    delivered_time: {
        type: Date
    },

    seen_time: {
        type: Date
    },

    is_deleted: {
        type: Boolean,
        default: false
    },

    status: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    }


});

ChatsMessageSchema.plugin(baseModel, {});


const ChatsModel = mongoose.model('chat_messages', ChatsMessageSchema);


// expose the access model
module.exports = ChatsModel;


/**

 author : user,
 type : 'text'
 text  : "HELLO"
 */
