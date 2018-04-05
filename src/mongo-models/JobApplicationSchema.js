import mongoose, {Schema} from "mongoose";
import baseModel from "./base";
import {JOB_APPLICATION_STATE, ROLES} from "../constants/application";


const stackState = {
    time: Date,
    state: String,
    comments: String,
    pending_action_id: mongoose.Schema.Types.ObjectId,
    action_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles'
    }
};

const offer = new Schema({
    title: String,
    date_of_joining: Date,
    salary: String,
    location: String,
    date: {
        type: Date,
        default: Date.now,
    }
});

let {
    matched, applied, closed, rejected, hired, not_interested, interested,
    offer_letter_rejected, offer_letter_sent
} = JOB_APPLICATION_STATE;

const JobApplicationSchema = new Schema({

    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting',
        required: true
    },

    job_posting: {
        type: Schema.Types.Mixed,
        required: true
    },

    /**
     * Employee Data
     */
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    user_profile: {
        type: Schema.Types.Mixed,
        required: true
    },

    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    state: {
        type: String,
        enum: [applied, interested, not_interested, matched, rejected,
            hired, offer_letter_sent, closed, offer_letter_rejected],
        required: true
        //TODO apply close when application is active and job is close
    },

    state_stack: {
        type: [stackState],
        default: []
    },

    source: {
        type: String,
        enum: [ROLES.EMPLOYER, ROLES.EMPLOYEE]
    },

    /**
     * Time stamps
     */
    interested_timestamp: {
        type: Date,
    },

    not_interested_timestamp: {
        type: Date
    },

    offer_letter_sent_timestamp: {
        type: Date,
    },

    hired_timestamp: {
        type: Date
    },

    rejected_timestamp: {
        type: Date
    },

    applied_timestamp: {
        type: Date
    },

    matched_timestamp: {
        type: Date
    },

    //TODO check and remove this, if not using any where
    active: {
        type: Boolean,
        default: true
    },
    //
    // offer_letter: {
    //     title: String,
    //     date_of_joining: Date,
    //     salary: String,
    //     location: String,
    // },


    offer_letter: {
        type: [offer]
    },

    seen_by_employee: {
        type: Boolean
    }

});

JobApplicationSchema.plugin(baseModel, {});

const JobApplicationModel = mongoose.model('job_applications', JobApplicationSchema);


// expose the access model
module.exports = JobApplicationModel;

