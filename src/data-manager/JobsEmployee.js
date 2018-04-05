let redis = require("../redis-module");
import JobPostingSchema from "../mongo-models/JobPostingSchema";
import JobApplicationSchema from "../mongo-models/JobApplicationSchema";
const JOB_CATEGORIES = "JOB_CATEGORIES";
const JOB_CATEGORIES_IMAGES = "JOB_CATEGORIES_IMAGES";

let JobsEmployeeDataManager = {

    async findJobs(query, {pageSize, pageNo}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobPostingSchema.find(query)
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({updated_at: -1})
            .lean();
    },

    async getJobApplicationDetails({job_id, user_id}){
        return JobApplicationSchema.findOne({job_id, user_id}).lean()
    },


    async getJobActive({employee}, {pageSize = 15, pageNo = 0}){
        let historyJobsQuery = {
            user_id: employee._id,
            state: {$nin: ["rejected", "hired", "not_interested", "closed"]}
        };
        return await JobApplicationSchema.find(historyJobsQuery).skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({updated_at: -1})
            .lean();
    },


    async getJobHistory({employee}, {pageSize, pageNo}){
        let historyJobsQuery = {
            user_id: employee._id,
            state: {$in: ["rejected", "hired", "not_interested", "closed", "offer_letter_rejected"]}
        };
        return await JobApplicationSchema.find(historyJobsQuery).skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({updated_at: -1})
            .lean();
    },


    async getJobHistoryCount({employee}){
        let historyJobsQuery = {
            user_id: employee._id,
            state: {$in: ["rejected", "hired", "not_interested", "closed", "offer_letter_rejected"]}
        };
        return await  JobApplicationSchema.count(historyJobsQuery)
    },

    async getJobActiveCount({employee}){
        let historyJobsQuery = {
            user_id: employee._id,
            state: {$nin: ["rejected", "hired", "not_interested", "closed"]}
        };
        return await  JobApplicationSchema.count(historyJobsQuery)
    }
};

export default JobsEmployeeDataManager;