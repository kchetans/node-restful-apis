import mongoose, {Schema} from "mongoose";
import mongoosastic from "mongoosastic";
import UsersExperienceSchema from "./UsersExperienceSchema";
import UsersEducationSchema from "./UsersEducationSchema";
import baseModel from "./base";
import {init as elastic} from "../elastic-search";
import {ROLES} from "../constants/application";
let elasticClient = elastic();

let PendingActions = new Schema({

    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_postings',
        required: true
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    }
});

const Permissions = new Schema({
    name: {
        type: String,
        enum: [
            "jobs-r", "jobs-w",
            "events-r", "events-w",
            "profile-r", "profile-w"
        ]
    }
});


const UserProfileSchema = new Schema({

    roles: {
        type: String,
        enum: [ROLES.EMPLOYEE, ROLES.EMPLOYER]
    },

    name: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        trim: true
    },


    ///todo: what ?
    overview: {
        type: String,
        trim: true
    },

    mobile_no: {
        type: String,
        trim: true,
        validate: {
            validator: mobile_no => {
                return /\d{10}/.test(mobile_no)
            },
            message: '{VALUE} Invalid Mobile No.'
        }
    },

    email: {
        type: String,
        trim: true
    },

    gender: {
        type: String,
        // enum: ['male', 'female', 'other']
    },

    dob: {
        type: Date
    },

    profile_pic_url: {
        type: String
    },

    cover_pic_url: {
        type: String
    },

    education: {
        type: String
    },

    languages: {
        type: [String]
    },

    city: {
        type: String
    },

    current_location: {
        type: String
    },

    /**
     * it will contain only last 10 location of user.
     */
    locations: {
        type: [{
            lat: {
                type: Number,
                default: 0
            },
            lon: {
                type: Number,
                default: 0
            },
            accuracy: Number,
            time: {
                type: Date,
                default: Date.now,
            },
        }],
        default: []
    },

    outlierFilterLocations: {
        type: [{
            lat: Number,
            lon: Number,
            accuracy: Number,
            time: {
                type: Date,
                default: Date.now,
            },
        }],
        default: []
    },

    location: {
        lat: Number,
        lon: Number,
        accuracy: Number,
        time: {
            type: Date,
            default: Date.now,
        },
    },

    views: {
        type: Number,
        default: 0
    },

    share: {
        type: Number,
        default: 0
    },

    total_experience: {
        type: String
    },

    total_experience_unit: {
        type: String,
        enum: ["years", "months", "days"],
        default: "years"
    },

    /**
     * Default preference
     */
    full_time_preferences: {
        type: [String]
    },

    part_time_preferences: {
        type: [String]
    },

    connections: {
        type: Number,
        default: 0
    },

    about: {
        type: String
    },

    designation: {
        type: String
    },

    company_name: {
        type: String
    },

    company_logo_url: {
        type: String
    },

    company_type: {
        type: String
    },

    web_site_url: {
        type: String
    },

    profile_percentage: {
        type: Number,
        default: 0
    },

    pending_actions: {
        type: [PendingActions],
        default: []
    },

    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_postings'
    }],

    asked_review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles'
    }],

    password: {
        type: String,
        es_indexed: false,
        trim: true
    },

    last_seen: {
        type: Date
    },

    is_mobile_verified: {
        type: Boolean,
        default: false
    },

    is_email_verified: {
        type: Boolean,
        default: false
    },

    subscriber_id: {
        type: String,
        es_indexed: false
    },

    auth_token: {
        type: String,
        es_indexed: false
    },

    app_language: {
        type: String
    },

    permissions: {
        type: [Permissions]
    },

    sim_info: {
        type: Schema.Types.Mixed
    },

    fb_id: {
        type: String
    },

    fb_info: {
        type: Schema.Types.Mixed
    },

    login_source: {
        type: String,
        enum: ["OTP", "SIM", "FACEBOOK"]
    }

});

UserProfileSchema.statics.updatePercentage = async function (user_id) {
    let totalEducation = await UsersEducationSchema.count({user_id});
    let totalExperiences = await UsersExperienceSchema.count({user_id});
    let userProfile = await this.findOne({_id: user_id}).lean();
    let userAttributes = ["name", "status", "mobile_no", "email", "gender",
        "dob", "profile_pic_url", "cover_pic_url", "languages", "current_location",
        "total_experience", "full_time_preferences", "about",
        "designation", "company_name", "full_time_preferences"];
    let profileCompetition = totalEducation > 1 ? 20 : totalEducation * 10;
    profileCompetition += totalExperiences > 1 ? 20 : totalExperiences * 10;
    _.map(userAttributes, userAttribute => {
        profileCompetition += _.has(userProfile, userAttribute) ? 5 : 0;
    });
    let profile_percentage = (profileCompetition / (userAttributes.length * 5 + 40)) * 100;
    this.update({_id: user_id}, {$set: {profile_percentage}}).exec();
    return profile_percentage;
};


UserProfileSchema.statics.increaseViewCount = async function (user_id) {
    this.update({user_id}, {$inc: {views: 1}}).exec();
};

UserProfileSchema.statics.increaseShareCount = async function (user_id) {
    this.update({user_id}, {$inc: {share: 1}}).exec();
};

UserProfileSchema.statics.updateCurrentJob = async function (user_id, {company_name, designation}) {
    this.update({user_id}, {$set: {company_name, designation}}).exec();
};

UserProfileSchema.statics.addToTotalExperience = async function (user_id, incEx) {
    this.update({user_id}, {$inc: {total_experience: incEx}}).exec();
};

UserProfileSchema.plugin(baseModel, {});

UserProfileSchema.plugin(mongoosastic, {
    esClient: elasticClient
});

const UserProfileModel = mongoose.model('user_profiles', UserProfileSchema);

// expose the access model
module.exports = UserProfileModel;

