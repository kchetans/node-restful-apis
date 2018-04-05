/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import mongoose, {Schema} from "mongoose";
import baseModel from "./base";
const DocumentsSchema = new Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_profiles',
        required: true
    },

    name: {
        type: String,
        trim: true
    },

    profile_pic_url: {
        type: String
    },

    document_type: {
        type: String,
        enum: [
            "aadhar_card", "passport", "pan_card", "driving_licence", "tenth", "twelfths",
            "degree", "diploma"
        ],
        required: true
    },

    document_no: {
        type: String,
        required: true
    },

    document_files: [{
        doc_name: {
            type: String
        },

        doc_url: {
            type: String,
            required: true
        }
    }]

});


DocumentsSchema.plugin(baseModel, {});
const DocumentsModel = mongoose.model('user_documents', DocumentsSchema);


// expose the access model
module.exports = DocumentsModel;
