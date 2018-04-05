import mongoose, {Schema} from "mongoose";
import baseModel from "./base";
import mongoosastic from "mongoosastic";
import {init as elastic} from "../elastic-search";
import {JOB_DESCRIPTION_MAX_LENGTH, JOB_DESCRIPTION_MIN_LENGTH} from "../constants/application";

let elasticClient = elastic();

const JobPostingSchema = new Schema({

    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles'
    },

    cover_pic_url: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
        validate: [
            {
                validator: description => description.length >= JOB_DESCRIPTION_MIN_LENGTH,
                message: `description should be al least ${JOB_DESCRIPTION_MIN_LENGTH} chars.`
            }, {
                validator: description => description.length <= JOB_DESCRIPTION_MAX_LENGTH,
                message: `description should be al least then ${JOB_DESCRIPTION_MAX_LENGTH} chars.`
            }
        ]
    },

    category: [{
        type: String,
        required: true
    }],

    type: {
        type: String,
        enum: ['full_time', 'part_time'],
        required: true
    },

    compensation: {
        type: String,
        required: true
    },

    is_draft: {
        type: Boolean,
        default: true
    },

    title: {
        type: String
    },

    company_logo_url: {
        type: String,
    },

    company_name: {
        type: String
    },

    contact_name: {
        type: String
    },

    contact_email: {
        type: String
    },

    contact_number: {
        type: String
    },

    job_days: {
        type: String,
    },

    job_timing: {
        type: Boolean,
    },

    start_date: {
        type: Date
    },

    end_date: {
        type: Date
    },

    min_salary: {
        type: Number
    },

    max_salary: {
        type: Number
    },

    work_experience: {
        type: Number
    },

    work_experience_unit: {
        type: String,
    },

    no_of_open_vacancies: {
        type: Number,
    },

    //TODO update attribute on insert
    no_of_applicant: {
        type: Number
    },

    no_of_close_vacancies: {
        type: Number,
    },

    language: {
        type: [String]
    },

    gender: {
        type: String,
    },

    min_qualification: {
        type: String
    },

    location: {
        lat: {
            type: Number,
            default: 0
        },
        lon: {
            type: Number,
            default: 0
        },
    },

    interview_details: {
        type: String
    },

    last_date: {
        type: Date
    },

    address: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        trim: true
    },

    formatted_address: {
        type: String,
        trim: true
    },

    views: {
        type: Number,
        default: 0
    },

    share: {
        type: Number,
        default: 0
    },

    is_active: {
        type: Boolean,
        default: true
    },

    address_raw: {
        type: Schema.Types.Mixed
    },

    mode: {
        type: String
    }

});

JobPostingSchema.statics.increaseViewCount = async function (_id) {
    this.update({_id}, {$inc: {views: 1}}).exec();
};

JobPostingSchema.statics.increaseShareCount = async function (_id) {
    this.update({_id}, {$inc: {share: 1}}).exec();
};

JobPostingSchema.plugin(baseModel, {});

JobPostingSchema.plugin(mongoosastic, {
    esClient: elasticClient
});

const JobPostingModel = mongoose.model('job_postings', JobPostingSchema);


// expose the access model
module.exports = JobPostingModel;

