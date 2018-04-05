import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const UserEducationSchema = new Schema({

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

    institute: {
        type: String,
        trim: true,
        required: true
    },

    course: {
        type: String,
        trim: true,
        required: true
    },

    start_date: {
        type: Date
    },

    end_date: {
        type: Date
    },

    is_currently_pursuing: {
        type: Boolean,
        default: false
    }

});

UserEducationSchema.plugin(baseModel, {});

const UserEducationModel = mongoose.model('user_educations', UserEducationSchema);


// expose the access model
module.exports = UserEducationModel;

