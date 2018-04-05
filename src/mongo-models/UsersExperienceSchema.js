import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const UserExperienceSchema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    name: {
        type: String,
        trim: true
    },

    profile_pic_url: {
        type: String
    },

    company: {
        type: String
    },

    duration: {
        type: String
    },

    duration_unit: {
        type: String,
        enum: ["years", "months", "days"],
        default: "years"
    },

    designation: {
        type: String,
        required: true
    },

    doj: {
        type: Date
    },

    dol: {
        type: Date
    },

    is_current_job: {
        type: Boolean,
        default: false
    }
});

UserExperienceSchema.plugin(baseModel, {});

const UserExperienceModel = mongoose.model('user_experiences', UserExperienceSchema);


// expose the access model
module.exports = UserExperienceModel;

