import mongoose, {Schema} from "mongoose";
import baseModel from "./base";

const socialProfile = new Schema({

    facebook_page: {
        type: String
    },
    twitter_handle: {
        type: String
    },
    instagram_page: {
        type: String
    },
    blog_url: {
        type: String
    },
    linkedin_url: {
        type: String
    },

});

const companyDetails = new Schema({
    about_company: {
        type: String
    },

    line_of_businesses: {
        type: [String]
    },

    no_of_employees: {
        type: String
    },

    no_of_clients: {
        type: String
    },

    no_of_courses: {
        type: String
    },

    no_of_facility: {
        type: String
    },

    accreditations: {
        type: [String]
    },

    date_of_incorporation: {
        type: Date
    },

    cin_no: {
        type: String
    }
});

const geoLocation = new Schema({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

const contactDetailsSchema = new Schema({

    web_site_url: {
        type: String
    },

    phone_no: {
        type: String
    },

    email: {
        type: String
    },

    geoLocation: {
        type: geoLocation
    },

    head_office_address: {
        type: String
    },

    address_line_2: {
        type: String
    },

    country: {
        type: String
    },

    pin_code: {
        type: String
    },

    state: {
        type: String
    },

    city: {
        type: String
    }
});

const registeredPersonSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    designation: {
        type: String
    },

    mobile_no: {
        type: String,
        required: true
    },

    email: {
        type: String
    }

});

const OrgSchema = new Schema({

    org_name: {
        type: String,
        required: true
    },

    org_code: {
        type: String,
        required: true,
        unique: true
    },

    org_logo_url: {
        type: String
    },

    org_type: {
        type: [{
            type: String,
            enum: ['Staffing', 'Training'],
        }],
        required: true
    },

    profile_filled_current_score: {
        type: String
    },

    profile_filled_score: {
        type: String
    },

    org_source: {
        type: String,
        enum: ['WEB', 'MOBILE', 'SCRIPT'],
        default: 'WEB'
    },

    org_caption: {
        type: String,
    },

    status: {
        type: String,
        enum: ['DRAFT', 'FINISHED'],
        default: 'DRAFT'
    },

    verified: {
        type: Boolean,
        default: false
    },

    industries_served: {
        type: [String]
    },

    registered_person: {
        type: registeredPersonSchema
    },

    contact_details: {
        type: contactDetailsSchema
    },

    about_company: {
        type: companyDetails
    },

    social_profiles: {
        type: socialProfile
    }

});

OrgSchema.plugin(baseModel, {});

OrgSchema.statics.checkOrgCode = async function (orgCode) {
    return !!await this.findOne({org_code: orgCode});
};

const OrgModel = mongoose.model('Organisation', OrgSchema);


// expose the access model
module.exports = OrgModel;

