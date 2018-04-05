import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const CommunicationsSchema = new Schema({
    
    mode: {
        type: String,
        enum: ['sms', 'email'],
        required: true,
    },

    type: {
        type: String,
        enum: ['promotional', 'transcational'],
        required: true
    },

    template: {
        type: String
    },

    to: {
        type: String
    },

    provider: {
        type: String
    },

    delivered_status: {
        type: String,
        enum: ['pending', 'failed', 'delivered'],
        default: 'pending'
    },

    status_udpate_time: {
        type: Date,
    }
});

CommunicationsSchema.plugin(baseModel, {});

const CommunicationsModel = mongoose.model('Communication', CommunicationsSchema);

// expose the access model
module.exports = CommunicationsModel;

