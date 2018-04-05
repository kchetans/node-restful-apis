import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const BranchesSchema = new Schema({

    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation'
    },

    org_code: {
        type: String,
        required: true
    },

    center_name: {
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
        type: String,
        required: true
    },

    email: {
        type: String
    },

    address: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    city: {
        type: String
    },

    state: {
        type: String
    },

    country: {
        type: String
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'IN_ACTIVE'],
        default: 'ACTIVE'
    },

});

BranchesSchema.plugin(baseModel, {});


const BranchesModel = mongoose.model('Centers', BranchesSchema);

// expose the access model
module.exports = BranchesModel;

