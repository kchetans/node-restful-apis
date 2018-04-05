let redis = require("../redis-module");
import JobPostingSchema from "../mongo-models/JobPostingSchema";
import {JOB_APPLICATION_STATE, PAGE_NO, PAGE_SIZE} from "../constants/application";
import JobApplicationSchema from "../mongo-models/JobApplicationSchema";
let errors = require("../errors");
const JOB_CATEGORIES = "JOB_CATEGORIES";
const JOB_CATEGORIES_IMAGES = "JOB_CATEGORIES_IMAGES";

let jobs = {

    async postJob({object, user}){
        return await new JobPostingSchema(object).save(user);
    },

    async updateJob(job_id, object){
        let jobPosted = await JobPostingSchema.findOrFail(job_id, `job with job_id : ${job_id} not found`);
        for (let key in object)
            jobPosted[key] = object[key]
        await jobPosted.save();
        return jobPosted.toJSON();
    },

    async closeJob(job_id){
        let jobInfo = await JobPostingSchema.findOrFail(job_id);
        if (jobInfo.is_active === false)
            throw new errors.ValidationError({message: "Job All ready closed"});
        jobInfo.is_active = false;
        await jobInfo.save();
        return jobInfo;
    },

    async getActiveJobs({employer, attributes = undefined}, {pageSize = PAGE_SIZE, pageNo = PAGE_NO}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobPostingSchema.find({created_by: employer._id}, attributes)
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({is_active: -1, updated_at: -1})
            .lean();
    },

    async getAllActiveJobs({employer, attributes = undefined}, removeIds){
        console.log("removeIds", removeIds);

        return await JobPostingSchema.find({
            created_by: employer._id,
            is_active: true,
            _id: {$nin: removeIds}
        }, attributes)
            .sort({created_at: -1})
            .lean();
    },

    async getAllJobs({pageSize = PAGE_SIZE, pageNo = PAGE_NO}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobPostingSchema.find({is_active: true})
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({created_at: -1})
            .lean();
    },

    async getClosedJobs({employer, attributes}, {pageSize = PAGE_SIZE, pageNo = PAGE_NO}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        let jobs = await JobPostingSchema.find({created_by: employer._id, is_active: false}, attributes)
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({created_at: -1})
            .lean();

    },


    async getRecommendedCandidates(){
        return [];
    },

    async getAppliedCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobs.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'applied');
    },

    async getShownInterestCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobs.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'interested');
    },

    async getMatchedCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobs.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, JOB_APPLICATION_STATE.matched);
    },

    async getHiredCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobs.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, JOB_APPLICATION_STATE.hired);
    },

    async getRejectedCandidates(){
        return await jobs.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, JOB_APPLICATION_STATE.applied);
    },

    async getOfferLetterSendCandidates(){
        return await jobs.__getStateCandidates({job_id, attributes}, {
            pageSize,
            pageNo
        }, JOB_APPLICATION_STATE.offer_letter_sent);
    },

    async __getStateCandidates({job_id, attributes}, {pageSize = PAGE_SIZE, pageNo = PAGE_NO}, state){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobApplicationSchema.find({job_id, state}, attributes)
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({created_at: -1})
            .lean();
    },

    async getRecommendedCandidatesCount({job_id}){
        return "10K";
    },

    async getAppliedCandidatesCount({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.applied);
    },

    async getMatchedCandidatesCount({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.matched);
    },

    async getHiredCandidatesCount({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.hired);
    },

    async getOfferLetterSendCandidatesCount({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.offer_letter_sent);
    },

    async getOfferLetterRejectedCandidatesCount({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.offer_letter_rejected);
    },


    async getCountInterested({job_id}){
        return await jobs.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.interested);
    },

    async __getStateCandidatesCount({job_id}, state){
        return await JobApplicationSchema.count({job_id, state})
    },

};

export default jobs;