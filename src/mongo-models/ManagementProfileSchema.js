import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const ManagementProfileSchema = new Schema({

    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },

    org_code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    phone_no: {
        type: String
    },

    email: {
        type: String
    },

    about: {
        type: String
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'IN_ACTIVE'],
        default: 'ACTIVE'
    },

});

ManagementProfileSchema.plugin(baseModel, {});


const ManagementProfileModel = mongoose.model('Management_Profile', ManagementProfileSchema);

// expose the access model
module.exports = ManagementProfileModel;

