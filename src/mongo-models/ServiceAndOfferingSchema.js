import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const ServiceAndOfferingSchema = new Schema({

    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },

    org_code: {
        type: String,
        required: true
    },

    service_type: {
        type: String,
        required: true
    },

    service_name: {
        type: String,
        required: true
    },

    about_service: {
        type: String
    },

    benefits_for_customers: {
        type: String
    },

    service_geographies: {
        type: [{
            type: String,
        }],
        required: true
    },

    brochure_urls: [{
        type: String
    }],

    status: {
        type: String,
        enum: ['ACTIVE', 'IN_ACTIVE'],
        default: 'ACTIVE'
    },

});

ServiceAndOfferingSchema.plugin(baseModel, {});


const ServiceAndOfferingModel = mongoose.model('Service_And_Offering', ServiceAndOfferingSchema);

// expose the access model
module.exports = ServiceAndOfferingModel;

