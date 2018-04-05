import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

/**
 * User Connections,
 * Connections are by directional
 */
const UserReviewsSchema = new Schema({

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

    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        require: true
    },

    author_name: {
        type: String
    },

    author_designation: {
        type: String
    },

    author_profile_pic_url: {
        type: String
    },

    text: {
        type: String
    },

    association: {
        type: String
    },

    is_public: {
        type: Boolean,
        default: true
    },

    is_deleted: {
        type: Boolean,
        default: false
    }
});

UserReviewsSchema.plugin(baseModel, {});

const UserConnectionsModel = mongoose.model('user_reviews', UserReviewsSchema);

// expose the access model
export default UserConnectionsModel;
