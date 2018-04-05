import mongoose, {Schema} from 'mongoose';
import baseModel from './base';


const Jobs = new Schema({

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_postings',
        required: true
    },

    rank: {
        type: String
    }

});

const RecommendedJobs = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        unique: true,
        required: true
    },

    jobs: {
        type: [Jobs],
        default: []
    }

});

RecommendedJobs.plugin(baseModel, {});

const RecommendedJobsModel = mongoose.model('recommended_jobs', RecommendedJobs);

// expose the access model
module.exports = RecommendedJobsModel;