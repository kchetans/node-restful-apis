/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import mongoose, {Schema} from "mongoose";

let ViewedBy = new Schema({

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

    view_time: {
        type: Date,
        default: Date.now
    },

    viewed_back: {
        type: Boolean,
        default: false
    }

});

const ProfileViewSchema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true,
        unique: true
    },

    view_by: [ViewedBy]

});

const ProfileViewModel = mongoose.model('user_profile_views', ProfileViewSchema);


// expose the access model
module.exports = ProfileViewModel;
