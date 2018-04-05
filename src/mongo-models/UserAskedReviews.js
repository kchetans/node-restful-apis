import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

const UserReviewsSchema = new Schema({

    // person who asked for review
    asked_from_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    asked_to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles'
    },

    name: {
        type: String
    },

    email: {
        type: String
    },

    mobile_no: {
        type: String
    },

    message: {
        type: String
    },

    token: {
        type: String,
        required: true,
        unique: true
    },

    review_given: {
        type: Boolean,
        default: false
    }

});

UserReviewsSchema.plugin(baseModel, {});

const UserConnectionsModel = mongoose.model('user_asked_reviews', UserReviewsSchema);

// expose the access model
export default UserConnectionsModel;
