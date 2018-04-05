import RecommendedUsers from "../mongo-models/RecommendedUsers";
import mongoose from "mongoose";
let redis = require("../redis-module");

let chats = {

    async removeUserfromRecomendation(job_id, user_id){
        return await RecommendedUsers.update({job_id}, {$pull: {users: {user: user_id}}});
    },


    async removeAllUserfromRecomendation(job_id){
        return await RecommendedUsers.update({job_id}, {$set: {users: []}});
    },

    async getRecommendedUsers(job_id, {pageSize, pageNo}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return _.map(await RecommendedUsers.aggregate([{$match: {job_id: mongoose.Types.ObjectId(job_id)}}, {$unwind: "$users"},
            {$sort: {"users.rank": -1}}, {
                $project: {
                    _id: 0,
                    user_id: "$users.user"
                }
            }, {$skip: pageSize * pageNo}, {$limit: pageSize}]), userInfo => userInfo.user_id);
    },

    async getRecommendedUsersCount(job_id){
        let rUser = await RecommendedUsers.aggregate([{$match: {job_id: mongoose.Types.ObjectId(job_id)}},
            {$project: {"users": 1}}, {$unwind: '$users'},
            {$group: {_id: 0, count: {$sum: 1}}}]);
        return (rUser && rUser[0] && rUser[0].count) || 0;
    }

};

export default chats;