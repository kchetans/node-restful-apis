import RecommendedJobs from "../mongo-models/RecommendedJobs";
import mongoose from "mongoose";
let redis = require("../redis-module");

let chats = {

    async removeJobfromRecomendation(user_id, job_id){
        return await  RecommendedJobs.update({user_id}, {$pull: {jobs: {job: job_id}}});
    },

    // when job closed this is called
    async removeJobfromRecomendationFromAllUser(job_id){
        return await  RecommendedJobs.update({}, {$pull: {jobs: {job: job_id}}}, {multi: true});
    },

    async getRecommendedJobs(employee, {pageSize, pageNo}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return _.map(await RecommendedJobs.aggregate([{$match: {user_id: mongoose.Types.ObjectId(employee._id)}}, {$unwind: "$jobs"},
            {$sort: {"jobs.rank": -1}}, {
                $project: {
                    _id: 0,
                    job_id: "$jobs.job"
                }
            }, {$skip: pageSize * pageNo}, {$limit: pageSize}]), jobInfo => jobInfo.job_id);
    },

    async getAllRecommendedJobs(employee){
        return _.map(await RecommendedJobs.aggregate([{$match: {user_id: mongoose.Types.ObjectId(employee._id)}}, {$unwind: "$jobs"},
            {$sort: {"jobs.rank": -1}}, {
                $project: {
                    _id: 0,
                    job_id: "$jobs.job"
                }
            }]), jobInfo => jobInfo.job_id);
    }

};

export default chats;