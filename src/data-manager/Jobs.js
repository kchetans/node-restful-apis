let redis = require("../redis-module");
import JobPostingSchema from "../mongo-models/JobPostingSchema";
import {APPLYING_ON_HIS_JOB} from "../constants/notification-messages";
const errors = require("../errors");
const JOB_CATEGORIES = "JOB_CATEGORIES";
const JOB_CATEGORIES_IMAGES = "JOB_CATEGORIES_IMAGES";

let jobs = {

    async checkEmployerIsApplyingOnHisJob (user_id, job_id) {
        let jobApplication = await JobPostingSchema.findOne({_id: job_id, employer_id: user_id});
        if (jobApplication) {
            throw new errors.ValidationError({message: APPLYING_ON_HIS_JOB});
        }
    },

    async findOrFail(...params){
        return await JobPostingSchema.findOrFail(...params);
    },

    async increaseViewCount(job_id){
        JobPostingSchema.increaseViewCount(job_id);
    },

};

export default jobs;