import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const Users = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    rank: {
        type: String
    }

});

const RecommendedUsers = new Schema({

    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_postings',
        unique: true,
        required: true
    },

    users: {
        type: [Users],
        default: []
    }

});

RecommendedUsers.plugin(baseModel, {});

const RecommendedUsersModel = mongoose.model('recommended_users', RecommendedUsers);


// expose the access model
module.exports = RecommendedUsersModel;

