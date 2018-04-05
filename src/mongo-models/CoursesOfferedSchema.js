import mongoose, {Schema} from "mongoose";
import baseModel from "./base";


const CoursesOfferedSchema = new Schema({

    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },


    org_code: {
        type: String,
        required: true
    },

    course_industry: {
        type: String,
        required: true
    },

    course_name: {
        type: String,
        required: true
    },

    about_course: {
        type: String
    },

    course_fees: {
        type: String
    },

    course_duration: {
        type: String
    },

    course_geographies: {
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

CoursesOfferedSchema.plugin(baseModel, {});


const CoursesOfferedModel = mongoose.model('Courses_Offered', CoursesOfferedSchema);

// expose the access model
module.exports = CoursesOfferedModel;

