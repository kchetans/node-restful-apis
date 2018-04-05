import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

const NotificationSchema = new Schema({

    forUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    type: {
        type: String,
        required: true
    },

    title: {
        type: String
    },

    body: {
        type: String,
        required: true
    },

    read: {
        type: Boolean,
        default: false
    },

    action: {
        code: {
            type: String,
            enum: [
                'chat', 'chat_detail',
                'profile', 'profile_detail',
                'job', 'job_detail',
            ]
        },
        args: Schema.Types.Mixed,
    }
});

NotificationSchema.plugin(baseModel, {});

const NotificationModel = mongoose.model('notification', NotificationSchema);

// expose the access model
export default NotificationModel;
